"use client";

export async function clearRuntimeCachesAndReload() {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.startsWith("arete-offline-pack"))
          .map((key) => caches.delete(key)),
      );
    }
  } catch {
    // Ignore.
  }
  try {
    const regs = await navigator.serviceWorker?.getRegistrations?.();
    if (regs) await Promise.all(regs.map((reg) => reg.update()));
  } catch {
    // Ignore.
  }
  window.location.reload();
}

