import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("AI_PROVIDER", "gateway");
  vi.stubEnv("AI_GATEWAY_API_KEY", "test-transport-fixture-only");
  vi.stubEnv("VERCEL_OIDC_TOKEN", "");
  vi.stubEnv("VERCEL", "");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });

const params = { system: "Test transport dispatch", messages: [{ role: "user" as const, content: "hello" }], userId: "test-user" };

// These fixtures exercise the real SDK and coach dispatch, not live model quality.
describe("coach provider dispatch", () => {
  it("sends Gateway requests with the read-only tools instead of returning the offline template", async () => {
    const transport = vi.fn(async () => Response.json({
      content: [{ type: "text", text: "gateway transport response" }],
      finishReason: { unified: "stop", raw: "stop" },
      usage: { inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 1, text: 1, reasoning: 0 } },
    }));
    vi.stubGlobal("fetch", transport);
    const { chatWithTools } = await import("../src/lib/ai/tools");
    expect(await chatWithTools(params)).toEqual({ text: "gateway transport response", toolCalls: [] });
    expect(transport).toHaveBeenCalledTimes(1);
    const [url, request] = transport.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(url)).toContain("https://ai-gateway.vercel.sh/");
    const body = JSON.parse(String(request.body));
    expect(body.tools.some((entry: { name: string }) => entry.name === "get_score_history")).toBe(true);
  });

  it("propagates Gateway access failures without retrying or producing mock text", async () => {
    const transport = vi.fn(async () => Response.json({ error: { message: "model access denied", type: "no_providers_available" } }, { status: 403 }));
    vi.stubGlobal("fetch", transport);
    const { chatWithTools } = await import("../src/lib/ai/tools");
    await expect(chatWithTools(params)).rejects.toThrow();
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it.each(["openia", ""])("rejects invalid production provider %j before any transport or data lookup", async (name) => {
    vi.stubEnv("AI_PROVIDER", name);
    const transport = vi.fn();
    vi.stubGlobal("fetch", transport);
    const { chatWithTools } = await import("../src/lib/ai/tools");
    await expect(chatWithTools(params)).rejects.toThrow(/AI_PROVIDER/);
    expect(transport).not.toHaveBeenCalled();
  });

  it("rejects missing real-provider credentials instead of executing the offline loop", async () => {
    vi.stubEnv("AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "");
    const { chatWithTools } = await import("../src/lib/ai/tools");
    await expect(chatWithTools(params)).rejects.toThrow(/OPENAI_API_KEY/);
  });
});
