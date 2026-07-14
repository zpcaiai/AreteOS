"use client";

// Fire-and-forget client telemetry. Best-effort: never awaited, never throws, uses
// sendBeacon when available so events survive navigation/unload. The sessionId groups
// a single tab session (in-memory; persists across client-side navigations).

import type { ClientEvent } from "@/lib/telemetry";

const sessionId =
  globalThis.crypto?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export function track(name: ClientEvent, props?: Record<string, unknown>): void {
  try {
    const body = JSON.stringify({ name, props, sessionId });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/telemetry", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Telemetry must never affect the UX.
  }
}
