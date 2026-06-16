// Generic in-process TTL cache for expensive read projections. Mirrors the
// computeScoresCached pattern (per-process; fine for a single Node server). The
// proper fix for the event-sourced engines is DB read-model projection tables +
// a projector — blocked offline (prisma generate); this removes the per-request
// recompute hot path in the meantime.

const store = new Map<string, { at: number; value: unknown }>();

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = await fn();
  store.set(key, { at: Date.now(), value });
  return value;
}

/** Drop cache entries whose key starts with `prefix` (call after writes). */
export function invalidateCache(prefix: string): void {
  for (const k of [...store.keys()]) if (k.startsWith(prefix)) store.delete(k);
}
