// Deep Work flagship service: sessions are event-sourced; the dashboard + heatmap
// are projections.

import { prisma } from "./db";
import { emit } from "./events";
import { deepWorkDashboard, type DeepWorkDashboard, type SessionTelemetry } from "./deep-work-math";
import { DeepWorkReviewCoach } from "./agents/deep-work";

const NS = "DeepWork";

export async function recordSession(userId: string, t: Omit<SessionTelemetry, "at"> & { at?: number; notes?: string }): Promise<{ ok: true }> {
  await emit({
    userId,
    aggregateType: NS,
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `dw_${Date.now()}`,
    type: "DeepWorkSession",
    payload: { durationMin: t.durationMin, distractions: t.distractions, difficulty: t.difficulty, outputQuality: t.outputQuality, notes: t.notes ?? "", at: t.at ?? Date.now() },
  }).catch(() => {});
  return { ok: true };
}

export async function reviewSession(t: { durationMin: number; distractions: number; difficulty: number; outputQuality: number; notes?: string }) {
  return DeepWorkReviewCoach.run({ ...t, notes: t.notes ?? "" });
}

export async function getDashboard(userId: string, windowDays = 28): Promise<DeepWorkDashboard> {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: NS, type: "DeepWorkSession" },
    orderBy: { occurredAt: "asc" },
    take: 2000,
    select: { payload: true, occurredAt: true },
  });
  const sessions: SessionTelemetry[] = rows.map((r) => {
    const p = (r.payload ?? {}) as Record<string, unknown>;
    return {
      durationMin: Number(p.durationMin) || 0,
      distractions: Number(p.distractions) || 0,
      difficulty: Number(p.difficulty) || 0,
      outputQuality: Number(p.outputQuality) || 0,
      at: Number(p.at) || r.occurredAt.getTime(),
    };
  });
  return deepWorkDashboard(sessions, windowDays);
}
