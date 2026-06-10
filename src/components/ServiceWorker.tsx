"use client";

import { useEffect } from "react";

/** Registers the PWA service worker (production only). */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is progressive enhancement — never block the app */
    });
  }, []);
  return null;
}
