import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError, pagination, requireSameOrigin, route } from "../src/lib/http";

afterEach(() => vi.unstubAllEnvs());

describe("HTTP input validation", () => {
  it.each(["null", "not a URL", "https://example.com/path", "https://example.com?x=1", "https://attacker.example"])
    ("rejects malformed or foreign Origin %s with 403 rather than 500", async (origin) => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
      const result = await route(async () => { requireSameOrigin(new Request("https://example.com/api", { headers: { origin } })); return new Response("ok"); });
      expect(result.status).toBe(403);
    });
  it("accepts the actual canonical browser origin", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(() => requireSameOrigin(new Request("https://example.com/api", { headers: { origin: "https://example.com" } }))).not.toThrow();
  });
  it("keeps originless development requests available", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(() => requireSameOrigin(new Request("http://localhost/api"))).not.toThrow();
  });
  it.each(["page=Infinity", "page=2.5", "page=NaN", "page=-1", "limit=Infinity", "limit=1.5", "limit=-1"])
    ("normalizes invalid pagination %s without passing invalid Prisma arguments", (query) => {
      expect(pagination(new Request(`https://example.com/api?${query}`))).toEqual({ page: 1, limit: 30, skip: 0 });
    });
  it("preserves valid pagination and caps the page size", () => {
    expect(pagination(new Request("https://example.com/api?page=3&limit=500"))).toEqual({ page: 3, limit: 100, skip: 200 });
  });
  it("rejects offsets beyond the database integer range before executing SQL", () => {
    expect(() => pagination(new Request("https://example.com/api?page=9007199254740991&limit=100"))).toThrow(HttpError);
  });
});
