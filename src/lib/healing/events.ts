// ───────────────────── Healing OS · event emitter (timeline spine) ─────────────────────
// Every healing service emits a lightweight DomainEvent (aggregateType
// "Healing:<module>") so the Batch-4 timeline can aggregate the whole journey
// from ONE place, while rich data stays in each typed table. Mirrors the
// event-sourced pattern in skills-service.ts. Fire-and-forget; never blocks the
// user-facing response.

import { emit } from "../events";
import { reportError } from "../logger";

export const HEALING_MODULES = [
  "safety",
  "intake",
  "dilts",
  "core-belief",
  "cbt",
  "emotion-regulation",
  "stabilization",
  "parts-work",
  "exposure",
  "exposure-attempt",
  "identity",
  "identity-evidence",
  "practice",
  "relapse",
  "relapse-checkin",
] as const;
export type HealingModule = (typeof HEALING_MODULES)[number];

export async function recordHealingEvent(params: {
  userId: string;
  sessionId?: string;
  module: HealingModule;
  type: string;
  recordId?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    await emit({
      userId: params.userId,
      aggregateType: `Healing:${params.module}`,
      aggregateId: params.recordId ?? globalThis.crypto?.randomUUID?.() ?? `heal_${Date.now()}`,
      type: params.type,
      payload: { sessionId: params.sessionId, module: params.module, ...(params.payload ?? {}) },
    });
  } catch (e) {
    reportError(e, { surface: "healing-event", module: params.module });
  }
}
