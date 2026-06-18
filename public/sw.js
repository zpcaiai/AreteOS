/* Arete service worker: cache-first for static assets, network-first for pages,
   tiny bilingual offline fallback. Versioned cache so deploys invalidate cleanly. */
const VERSION = "arete-v2";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

function offlineHtml(req) {
  const en = /(?:^|;\s*)locale=en(?:;|$)/.test((req && req.headers.get("cookie")) || "");
  const lang = en ? "en" : "zh-CN";
  const h1 = en ? "You're offline" : "你当前处于离线状态";
  const p = en
    ? "Arete needs a connection for live data. Reconnect and retry."
    : "Arete 需要联网获取实时数据。请恢复网络后重试。";
  return `<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Arete — offline</title><body style="background:#0f172a;color:#e2e8f0;font-family:system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center"><div style="text-align:center"><h1 style="font-size:20px">${h1}</h1><p style="color:#94a3b8;font-size:14px">${p}</p></div></body></html>`;
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(["/manifest.webmanifest", "/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION) && !k.startsWith("arete-offline-pack")).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API responses or auth flows.
  if (url.pathname.startsWith("/api/")) return;

  const isStatic = url.pathname.startsWith("/_next/static/") || /\.(svg|png|ico|woff2?)$/.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Pages: network first, fall back to cache, then bilingual offline page.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        return hit || new Response(offlineHtml(req), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }),
  );
});
