"use client";

import { lazy } from "react";

const KEY = "arete-lazy-chunk-reload";
const KEEP_CACHE_PREFIXES = ["arete-offline-pack"];

async function purgeRuntimeCaches() {
  try {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => !KEEP_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix)))
        .map((key) => caches.delete(key)),
    );
  } catch {
    // Cache cleanup is best effort.
  }
}

export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    importer()
      .then((mod) => {
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          // Ignore storage failures.
        }
        return mod;
      })
      .catch(async (error) => {
        let alreadyReloaded = false;
        try {
          alreadyReloaded = sessionStorage.getItem(KEY) === "1";
          sessionStorage.setItem(KEY, "1");
        } catch {
          // Ignore storage failures.
        }
        if (!alreadyReloaded) {
          await purgeRuntimeCaches();
          window.location.reload();
          return new Promise<{ default: T }>(() => undefined);
        }
        throw error;
      }),
  );
}

