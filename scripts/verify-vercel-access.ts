import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

type ReleaseEnv = Record<string, string | undefined>;

/** Read-only preflight. This verifies target access, not successful deployment. */
export async function verifyVercelAccess(env: ReleaseEnv = process.env, request: typeof fetch = fetch) {
  for (const name of ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID"] as const) {
    const value = env[name];
    if (!value || /\s/.test(value)) throw new Error(`VERCEL_CONFIG_INVALID: ${name} is missing or contains whitespace`);
  }
  const projectId = env.VERCEL_PROJECT_ID!;
  const teamId = env.VERCEL_ORG_ID!;
  const url = new URL(`https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}`);
  url.searchParams.set("teamId", teamId);
  let response: Response;
  try {
    response = await request(url, {
      headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("VERCEL_NETWORK_ERROR: project access check failed or timed out; no deployment attempted");
  }
  // Never echo upstream messages, bodies or request headers: they may contain secrets.
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 || body?.error?.invalidToken === true) {
      throw new Error("VERCEL_AUTH_INVALID: replace the Actions VERCEL_TOKEN with a valid scoped access token; check expiration or revocation");
    }
    if (response.status === 403 || response.status === 404) {
      throw new Error("VERCEL_TARGET_ACCESS_DENIED: check token project/team scope, membership and release target IDs");
    }
    throw new Error(`VERCEL_API_ERROR: project access check returned HTTP ${response.status}; no deployment attempted`);
  }
  if (body?.id !== projectId || body?.accountId !== teamId) {
    throw new Error("VERCEL_TARGET_MISMATCH: API response does not match the configured production project and team");
  }
  return { projectId, teamId, readAccess: "verified" as const };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyVercelAccess().then(
    (result) => console.log(JSON.stringify(result)),
    (error: Error) => { console.error(error.message); process.exitCode = 1; },
  );
}
