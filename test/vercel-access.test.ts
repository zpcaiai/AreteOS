import { describe, expect, it, vi } from "vitest";
import { verifyVercelAccess } from "../scripts/verify-vercel-access";

const env = { VERCEL_TOKEN: "private-token-fixture", VERCEL_ORG_ID: "team_fixture", VERCEL_PROJECT_ID: "prj_fixture" };

describe("read-only Vercel release access preflight", () => {
  it.each(["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID"] as const)("rejects absent %s before network access", async (key) => {
    const request = vi.fn<typeof fetch>();
    await expect(verifyVercelAccess({ ...env, [key]: "" }, request)).rejects.toThrow(`VERCEL_CONFIG_INVALID: ${key}`);
    expect(request).not.toHaveBeenCalled();
  });

  it.each([" ", "leading ", "line\nbreak"])("rejects whitespace credentials without exposing their content", async (value) => {
    const request = vi.fn<typeof fetch>();
    await expect(verifyVercelAccess({ ...env, VERCEL_TOKEN: value }, request)).rejects.toThrow("VERCEL_CONFIG_INVALID: VERCEL_TOKEN");
    expect(request).not.toHaveBeenCalled();
  });

  it("sends a bounded non-redirecting request scoped to the exact project/team", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: env.VERCEL_PROJECT_ID, accountId: env.VERCEL_ORG_ID }));
    await expect(verifyVercelAccess(env, request)).resolves.toEqual({ projectId: "prj_fixture", teamId: "team_fixture", readAccess: "verified" });
    const [url, options] = request.mock.calls[0];
    expect(String(url)).toBe("https://api.vercel.com/v9/projects/prj_fixture?teamId=team_fixture");
    expect(options?.headers).toEqual({ Authorization: `Bearer ${env.VERCEL_TOKEN}` });
    expect(options?.redirect).toBe("error");
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([401, 403])("identifies invalid tokens from HTTP %s without leaking upstream data", async (status) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: { invalidToken: true, message: env.VERCEL_TOKEN } }, { status }));
    let error: unknown;
    try { await verifyVercelAccess(env, request); } catch (caught) { error = caught; }
    expect(error).toBeInstanceOf(Error);
    expect(String(error)).toContain("VERCEL_AUTH_INVALID");
    expect(String(error)).not.toContain(env.VERCEL_TOKEN);
  });

  it.each([403, 404])("distinguishes denied target access at HTTP %s", async (status) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: { code: "forbidden" } }, { status }));
    await expect(verifyVercelAccess(env, request)).rejects.toThrow("VERCEL_TARGET_ACCESS_DENIED");
  });

  it.each([429, 500, 503])("fails closed for HTTP %s without retries", async (status) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(env.VERCEL_TOKEN, { status }));
    await expect(verifyVercelAccess(env, request)).rejects.toThrow(`VERCEL_API_ERROR: project access check returned HTTP ${status}`);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it.each([
    { id: "other", accountId: env.VERCEL_ORG_ID },
    { id: env.VERCEL_PROJECT_ID, accountId: "other" },
    {},
  ])("refuses a mismatched or malformed successful response", async (body) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json(body));
    await expect(verifyVercelAccess(env, request)).rejects.toThrow("VERCEL_TARGET_MISMATCH");
  });

  it("refuses non-JSON successful responses", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response("not JSON"));
    await expect(verifyVercelAccess(env, request)).rejects.toThrow("VERCEL_TARGET_MISMATCH");
  });

  it("sanitizes network errors containing credentials", async () => {
    const request = vi.fn<typeof fetch>().mockRejectedValue(new Error(env.VERCEL_TOKEN));
    await expect(verifyVercelAccess(env, request)).rejects.toThrow("VERCEL_NETWORK_ERROR");
    expect(request).toHaveBeenCalledTimes(1);
  });
});
