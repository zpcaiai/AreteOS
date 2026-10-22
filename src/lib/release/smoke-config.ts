function milliseconds(name: string, fallback: number, env: NodeJS.ProcessEnv) {
  const value = Number(env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value <= 0 || value > 4_294_967_295) {
    throw new Error(`${name} must be a positive integer number of milliseconds (maximum 4294967295)`);
  }
  return value;
}

export function productionSmokeConfig(env: NodeJS.ProcessEnv = process.env) {
  let url: URL;
  try { url = new URL((env.PRODUCTION_URL || env.NEXT_PUBLIC_SITE_URL || "").trim()); }
  catch { throw new Error("PRODUCTION_URL must be a canonical https origin"); }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PRODUCTION_URL must be a canonical https origin without credentials, path, query or fragment");
  }
  return {
    base: url.origin,
    healthSloMs: milliseconds("HEALTH_SLO_MS", 5000, env),
    pageSloMs: milliseconds("PAGE_SLO_MS", 5000, env),
    timeoutMs: milliseconds("SMOKE_TIMEOUT_MS", 10000, env),
  };
}
