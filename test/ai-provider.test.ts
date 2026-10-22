import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runtimeReadiness } from "../src/lib/release/readiness";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("AI_PROVIDER", "mock");
  for (const key of ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "AI_GATEWAY_API_KEY", "VERCEL_OIDC_TOKEN", "VERCEL"]) {
    vi.stubEnv(key, "");
  }
});

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

async function provider() { return (await import("../src/lib/ai/provider")).getProvider(); }

describe("AI provider configuration", () => {
  it("rejects an unknown provider instead of returning example outputs", async () => {
    vi.stubEnv("AI_PROVIDER", "openia");
    await expect(provider()).rejects.toThrow(/provider/i);
    expect(runtimeReadiness({ NODE_ENV: "test", AI_PROVIDER: "openia" }).failed).toContain("real-ai-provider");
  });

  it.each(["openai", "anthropic", "gateway"])("rejects missing credentials for %s", async (name) => {
    vi.stubEnv("AI_PROVIDER", name);
    await expect(provider()).rejects.toThrow(/credential|key|auth/i);
  });

  it("rejects whitespace credentials", async () => {
    vi.stubEnv("AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "   ");
    await expect(provider()).rejects.toThrow(/credential|key/i);
  });

  it("uses the same provider normalization as the readiness gate", async () => {
    vi.stubEnv("AI_PROVIDER", " OpenAI ");
    vi.stubEnv("OPENAI_API_KEY", "example-key");
    expect((await provider()).name).toBe("openai");
    const report = runtimeReadiness({ NODE_ENV: "test", AI_PROVIDER: " OpenAI ", OPENAI_API_KEY: "example-key" });
    expect(report.failed).not.toContain("real-ai-provider");
    expect(report.failed).not.toContain("ai-credentials");
  });

  it("allows explicit mock execution for offline development", async () => {
    const selected = await provider();
    expect(selected.name).toBe("mock");
    expect(await selected.complete({ system: "", user: "" })).toBe("__MOCK__");
  });

  it.each(["mock", ""])("refuses production example output for provider %j", async (name) => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AI_PROVIDER", name);
    await expect(provider()).rejects.toThrow(/production|provider/i);
  });

  it("keeps real Gateway OIDC selection available on Vercel", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AI_PROVIDER", "gateway");
    vi.stubEnv("VERCEL", "1");
    expect((await provider()).name).toBe("gateway");
  });
});
