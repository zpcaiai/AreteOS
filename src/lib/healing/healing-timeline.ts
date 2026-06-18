// ───────────────────── Healing OS · Timeline service ─────────────────────
// Aggregates Healing:* DomainEvents + PracticeTask stats → metrics → narrative.
import { prisma } from "../db";
import { reportError } from "../logger";
import { HealingTimelineNarrator } from "../agents/healing-timeline";
import {
  normalizeTimelineEvents,
  computeProgressMetrics,
  overallDirection,
  detectStuckPoints,
  type HealingEventLite,
} from "./timeline-logic";
import { type HealingTimelineInput, type HealingTimelineOutput, type TimelineNarrative, TimelineNarrativeSchema } from "../domain/timeline";

export async function runHealingTimeline(input: HealingTimelineInput): Promise<HealingTimelineOutput> {
  const from = new Date(input.timeRange.from);
  const to = new Date(input.timeRange.to);
  const events = await loadHealingEvents(input.userId, from, to);
  const practice = await loadPracticeStats(input.userId, from, to);

  const metrics = computeProgressMetrics(events, practice);
  const direction = overallDirection(events, metrics);
  const stuck = detectStuckPoints(events, metrics);
  const timelineEvents = normalizeTimelineEvents(events).sort((a, b) => a.date.localeCompare(b.date));

  const metricsSummary = `练习完成率 ${(metrics.practiceCompletionRate * 100).toFixed(0)}%（${metrics.completedPracticeTasks}/${metrics.totalPracticeTasks}），暴露完成 ${metrics.exposureCompletionCount}，身份证据 ${metrics.identityEvidenceCount}，风险趋势 ${metrics.riskTrend}`;
  const eventSummary = summarizeCounts(events);

  let narrative: TimelineNarrative;
  try {
    narrative = await HealingTimelineNarrator.run({ overallDirection: direction, metricsSummary, eventSummary, stuckHints: stuck.map((s) => s.stuckPoint), language: "zh" });
  } catch (e) {
    reportError(e, { surface: "timeline", stage: "narrate" });
    narrative = TimelineNarrativeSchema.parse({
      summaryText: direction === "insufficient_data" ? "目前数据还不足以判断趋势，继续记录即可。" : "已汇总你近期的练习与会谈。",
      patternChanges: [],
      growthEvidence: [],
      stuckPoints: stuck,
      nextStepRecommendations: [],
      userFacingWeeklyReport: "继续保持小步前进，下周我们再回看变化。",
    });
  }

  const output: HealingTimelineOutput = {
    timelineSummary: { timeRange: `${input.timeRange.from} → ${input.timeRange.to}`, overallDirection: direction, summaryText: narrative.summaryText },
    timelineEvents,
    progressMetrics: metrics,
    patternChanges: narrative.patternChanges,
    growthEvidence: narrative.growthEvidence,
    stuckPoints: narrative.stuckPoints.length ? narrative.stuckPoints : stuck,
    nextStepRecommendations: narrative.nextStepRecommendations,
    userFacingWeeklyReport: narrative.userFacingWeeklyReport,
  };

  await persist(input, output, from, to);
  return output;
}

async function loadHealingEvents(userId: string, from: Date, to: Date): Promise<HealingEventLite[]> {
  try {
    const rows = (await prisma.domainEvent.findMany({
      where: { userId, occurredAt: { gte: from, lte: to }, aggregateType: { startsWith: "Healing:" } },
      orderBy: { occurredAt: "asc" },
      select: { aggregateType: true, type: true, occurredAt: true, payload: true },
    })) as unknown as { aggregateType: string; type: string; occurredAt: Date; payload: unknown }[];
    return rows.map((r) => ({ module: r.aggregateType.replace("Healing:", ""), type: r.type, occurredAt: r.occurredAt.toISOString(), payload: (r.payload as Record<string, unknown>) ?? {} }));
  } catch (e) {
    reportError(e, { surface: "timeline", stage: "load-events" });
    return [];
  }
}

async function loadPracticeStats(userId: string, from: Date, to: Date): Promise<{ total: number; completed: number }> {
  try {
    const [total, completed] = await Promise.all([
      prisma.practiceTask.count({ where: { userId, createdAt: { gte: from, lte: to } } }),
      prisma.practiceTask.count({ where: { userId, createdAt: { gte: from, lte: to }, status: "completed" } }),
    ]);
    return { total, completed };
  } catch (e) {
    reportError(e, { surface: "timeline", stage: "load-practice" });
    return { total: 0, completed: 0 };
  }
}

function summarizeCounts(events: HealingEventLite[]): string {
  const counts = new Map<string, number>();
  for (const e of events) counts.set(e.module, (counts.get(e.module) ?? 0) + 1);
  return [...counts.entries()].map(([m, n]) => `${m}×${n}`).join(", ") || "(无事件)";
}

async function persist(input: HealingTimelineInput, output: HealingTimelineOutput, from: Date, to: Date) {
  try {
    await prisma.healingTimelineReport.create({
      data: {
        userId: input.userId,
        timeRangeFrom: from,
        timeRangeTo: to,
        reportMode: input.reportMode,
        timelineSummary: output.timelineSummary,
        timelineEvents: output.timelineEvents,
        progressMetrics: output.progressMetrics,
        patternChanges: output.patternChanges,
        growthEvidence: output.growthEvidence,
        stuckPoints: output.stuckPoints,
        nextStepRecommendations: output.nextStepRecommendations,
        userFacingWeeklyReport: output.userFacingWeeklyReport,
      },
    });
  } catch (e) {
    reportError(e, { surface: "timeline", stage: "persist" });
  }
}
