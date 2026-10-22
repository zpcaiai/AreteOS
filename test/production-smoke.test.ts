import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { productionSmokeConfig } from "../src/lib/release/smoke-config";

const valid: NodeJS.ProcessEnv = { NODE_ENV: "test", PRODUCTION_URL: "https://example.com/" };

describe("production smoke configuration", () => {
  it("preserves the existing strict SLOs and canonicalizes the origin", () => {
    expect(productionSmokeConfig(valid)).toEqual({ base: "https://example.com", healthSloMs: 5000, pageSloMs: 5000, timeoutMs: 10000 });
  });
  it("supports the existing site URL fallback and explicit timing settings", () => {
    expect(productionSmokeConfig({ NODE_ENV: "test", NEXT_PUBLIC_SITE_URL: "https://example.com", HEALTH_SLO_MS: "4000", PAGE_SLO_MS: "3000", SMOKE_TIMEOUT_MS: "9000" }))
      .toEqual({ base: "https://example.com", healthSloMs: 4000, pageSloMs: 3000, timeoutMs: 9000 });
  });
  it.each(["HEALTH_SLO_MS", "PAGE_SLO_MS", "SMOKE_TIMEOUT_MS"])("rejects invalid %s before it can disable a gate", (key) => {
    for (const value of ["NaN", "Infinity", "-1", "0", "", " ", "1.5", "4294967296"]) {
      expect(() => productionSmokeConfig({ ...valid, [key]: value })).toThrow(key);
    }
  });
  it.each(["", "https://", "http://example.com", "https://user:password@example.com", "https://example.com/api", "https://example.com?token=secret", "https://example.com#fragment"])
    ("rejects an unsafe or ambiguous production target %s", (PRODUCTION_URL) => {
      expect(() => productionSmokeConfig({ NODE_ENV: "test", PRODUCTION_URL })).toThrow("PRODUCTION_URL");
    });
  it("fails the actual smoke entrypoint on malformed SLO configuration before fetching", () => {
    const result = spawnSync(process.execPath, [resolve("node_modules/tsx/dist/cli.mjs"), resolve("scripts/production-smoke.ts")], {
      env: { ...process.env, PRODUCTION_URL: "https://127.0.0.1:1", HEALTH_SLO_MS: "NaN" },
      encoding: "utf8", timeout: 20_000,
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("HEALTH_SLO_MS must be a positive integer");
    expect(result.stderr).not.toContain("fetch failed");
  });
});
