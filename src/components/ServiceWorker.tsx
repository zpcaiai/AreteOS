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
    // Never force-reload an active page when an update installs. A reload can
    // destroy unsaved form input or interrupt a payment/AI request. The new
    // worker takes control safely and the next user navigation gets the update.
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {
      /* offline support is progressive enhancement — never block the app */
    });
  }, []);
  return null;
}
