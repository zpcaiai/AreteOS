export {};

const base = (process.env.PRODUCTION_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
if (!base.startsWith("https://")) throw new Error("PRODUCTION_URL must be an https URL");

async function get(path: string) {
  const started = Date.now();
  const response = await fetch(`${base}${path}`, { redirect: "follow", headers: { "User-Agent": "AreteOS-production-smoke/1.0" } });
  const body = await response.text();
  return { path, status: response.status, ms: Date.now() - started, body };
}

const results = await Promise.all([
  get("/api/health"),
  get("/privacy"),
  get("/terms"),
  get("/login"),
]);

for (const result of results) console.log(`${result.status} ${result.ms}ms ${result.path}`);
const health = results[0];
if (health.status !== 200) throw new Error(`Production health failed (${health.status}): ${health.body.slice(0, 500)}`);
const parsed = JSON.parse(health.body) as { status?: string; version?: string };
if (parsed.status !== "ready") throw new Error(`Production is not ready: ${health.body.slice(0, 500)}`);
if (process.env.EXPECTED_COMMIT_SHA && parsed.version !== process.env.EXPECTED_COMMIT_SHA.slice(0, 12)) {
  throw new Error(`Production version mismatch: expected ${process.env.EXPECTED_COMMIT_SHA.slice(0, 12)}, received ${parsed.version || "unknown"}`);
}
for (const result of results.slice(1)) {
  if (result.status !== 200 || !result.body.includes("Arete")) throw new Error(`Smoke check failed for ${result.path}`);
}
console.log(`Production smoke passed for ${base} (${parsed.version || "unknown version"})`);
