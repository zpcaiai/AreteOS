"use client";

import { useEffect } from "react";

/** Registers the PWA service worker (production only). */
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations()
        .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
        .then(async () => {
          if (!("caches" in window)) return;
          const keys = await caches.keys();
          await Promise.all(keys.filter((key) => !key.startsWith("arete-offline-pack")).map((key) => caches.delete(key)));
        })
        .catch(() => undefined);
      return;
    }
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((registration) => {
      registration.addEventListener("updatefound", () => {
        const next = registration.installing;
        if (!next) return;
        next.addEventListener("statechange", () => {
          if (next.state === "activated" && navigator.serviceWorker.controller) {
            const key = "arete-sw-reloaded";
            if (sessionStorage.getItem(key) !== "1") {
              sessionStorage.setItem(key, "1");
              window.location.reload();
            }
          }
        });
      });
    }).catch(() => {
      /* offline support is progressive enhancement — never block the app */
    });
  }, []);
  return null;
}
