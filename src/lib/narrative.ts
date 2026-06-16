// Growth-narrative orchestrator. Reads the event-sourced history (growth
// snapshots, domain events, stage transitions), extracts signals (pure), and
// optionally renders them into prose via GrowthNarrator.

import { prisma } from "./db";
import { emit } from "./events";
import { GrowthNarrator } from "./agents/narrative";
import { assembleNarrativeSignals, type NarrativeSignals, type ScorePoint, type StageTransition } from "./narrative-math";

const DAY = 86_400_000;

export interface NarrativeResult {
  periodDays: number;
  signals: NarrativeSignals;
  narrative: Awaited<ReturnType<typeof GrowthNarrator.run>> | null;
}

function fmtDate(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

export async function buildGrowthNarrative(
  userId: string,
  opts: { periodDays?: number; withProse?: boolean } = {},
): Promise<NarrativeResult> {
  const periodDays = Math.min(Math.max(opts.periodDays ?? 90, 7), 1825);
  const since = new Date(Date.now() - periodDays * DAY);

  const [snapshots, events, transitions] = await Promise.all([
    prisma.scoreSnapshot.findMany({ where: { userId, kind: "GROWTH", date: { gte: since } }, orderBy: { date: "asc" }, select: { value: true, date: true } }),
    prisma.domainEvent.findMany({ where: { userId, occurredAt: { gte: since } }, select: { aggregateType: true } }),
    prisma.personalityTransition.findMany({ where: { userId, createdAt: { gte: since } }, orderBy: { createdAt: "asc" }, select: { fromStage: true, toStage: true, createdAt: true } }),
  ]);

  const points: ScorePoint[] = snapshots.map((s) => ({ at: s.date.getTime(), value: s.value }));
  const stageTransitions: StageTransition[] = transitions.map((t) => ({ fromStage: String(t.fromStage), toStage: String(t.toStage), at: t.createdAt.getTime() }));

  const signals = assembleNarrativeSignals({ points, events, transitions: stageTransitions });

  let narrative: NarrativeResult["narrative"] = null;
  if (opts.withProse) {
    narrative = await GrowthNarrator.run({
      periodLabel: `the last ${periodDays} days`,
      momentum: signals.trajectory.momentum,
      changePct: signals.trajectory.change * 100,
      topEngine: signals.activity.topEngine,
      turningPoints: signals.turningPoints.map((t) => `${t.direction === "up" ? "+" : ""}${(t.delta * 100).toFixed(1)} pts on ${fmtDate(t.at)}`),
      transitions: signals.transitions.map((t) => `${t.fromStage} → ${t.toStage}`),
    });
  }

  await emit({
    userId,
    aggregateType: "Narrative",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `narrative_${Date.now()}`,
    type: "NarrativeGenerated",
    payload: { periodDays, momentum: signals.trajectory.momentum, changePct: signals.trajectory.change * 100, turningPoints: signals.turningPoints.length },
  }).catch(() => {});

  return { periodDays, signals, narrative };
}
