"use client";

const PACK = "arete-offline-pack-v1";

const keyUrl = (kind: string, id: string) =>
  `${location.origin}/__arete-offline/${kind}/${encodeURIComponent(id)}`;

export async function putOfflineJson(kind: string, id: string, data: unknown) {
  try {
    const cache = await caches.open(PACK);
    await cache.put(
      keyUrl(kind, id),
      new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }),
    );
  } catch {
    // Cache API may be unavailable or full.
  }
}

export async function getOfflineJson<T>(kind: string, id: string): Promise<T | null> {
  try {
    const cache = await caches.open(PACK);
    const res = await cache.match(keyUrl(kind, id));
    return res ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function offlinePackSize() {
  try {
    const cache = await caches.open(PACK);
    return (await cache.keys()).length;
  } catch {
    return 0;
  }
}

