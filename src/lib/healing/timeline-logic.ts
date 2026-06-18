// ───────────── Healing OS · Timeline pure logic (deterministic aggregation) ─────────────
import type { ProgressMetrics, TimelineEvent, TimelineEventType, OverallDirection } from "../domain/timeline";
import { RISK_RANK, type RiskLevel } from "../domain/risk";

export interface HealingEventLite {
  module: string;
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface PracticeStats {
  total: number;
  completed: number;
}

const MODULE_TO_EVENT: Record<string, TimelineEventType> = {
  safety: "safety_event", intake: "intake", dilts: "formulation", "core-belief": "belief_reconstruction",
  cbt: "cbt_session", "emotion-regulation": "emotion_regulation", stabilization: "stabilization", "parts-work": "parts_work",
  exposure: "exposure_plan", "exposure-attempt": "exposure_attempt", identity: "identity_reconstruction",
  "identity-evidence": "identity_evidence", practice: "practice_created",
};

/** Map raw Healing:* events to timeline events. */
export function normalizeTimelineEvents(events: HealingEventLite[]): TimelineEvent[] {
  return events.map((e) => {
    let eventType: TimelineEventType = MODULE_TO_EVENT[e.module] ?? "safety_event";
    if (e.module === "practice" && e.type === "PracticeTaskCompleted") eventType = "practice_completed";
    if (e.module === "safety" && (e.payload.riskLevel === "orange" || e.payload.riskLevel === "red")) eventType = "relapse_signal";
    const sig: "low" | "medium" | "high" = e.payload.riskLevel === "red" ? "high" : e.payload.riskLevel === "orange" || eventType === "exposure_attempt" || eventType === "identity_evidence" ? "medium" : "low";
    return { date: e.occurredAt, eventType, title: `${e.module}:${e.type}`, significance: sig };
  });
}

/** Risk trend from the sequence of safety events (improving = risk falling). */
export function riskTrend(events: HealingEventLite[]): string {
  const risks = events.filter((e) => e.module === "safety" && typeof e.payload.riskLevel === "string").map((e) => RISK_RANK[e.payload.riskLevel as RiskLevel] ?? 0);
  if (risks.length < 2) return "insufficient";
  const mid = Math.floor(risks.length / 2);
  const firstAvg = risks.slice(0, mid).reduce((a, b) => a + b, 0) / Math.max(1, mid);
  const secondAvg = risks.slice(mid).reduce((a, b) => a + b, 0) / Math.max(1, risks.length - mid);
  if (secondAvg < firstAvg - 0.25) return "improving";
  if (secondAvg > firstAvg + 0.25) return "declining";
  return "stable";
}

export function computeProgressMetrics(events: HealingEventLite[], practice: PracticeStats): ProgressMetrics {
  const count = (m: string, t?: string) => events.filter((e) => e.module === m && (!t || e.type === t)).length;
  const sessionModules = ["intake", "dilts", "core-belief", "cbt", "emotion-regulation", "stabilization", "parts-work", "exposure", "identity"];
  const totalSessions = events.filter((e) => sessionModules.includes(e.module)).length;
  const exposureCompletionCount = count("exposure-attempt", "ExposureAttemptCompleted");
  const identityEvidenceCount = count("identity-evidence", "IdentityEvidenceLogged");
  return {
    practiceCompletionRate: practice.total > 0 ? practice.completed / practice.total : 0,
    exposureCompletionCount,
    identityEvidenceCount,
    riskTrend: riskTrend(events),
    avoidanceTrend: exposureCompletionCount > 0 ? "decreasing" : "unknown",
    totalSessions,
    totalPracticeTasks: practice.total,
    completedPracticeTasks: practice.completed,
  };
}

export function overallDirection(events: HealingEventLite[], metrics: ProgressMetrics): OverallDirection {
  if (events.length < 3 && metrics.totalPracticeTasks === 0) return "insufficient_data";
  const recentRed = events.some((e) => e.module === "safety" && e.payload.riskLevel === "red");
  if (metrics.riskTrend === "declining" || recentRed) return "declining";
  const progressing = metrics.practiceCompletionRate >= 0.5 && (metrics.identityEvidenceCount > 0 || metrics.exposureCompletionCount > 0);
  if (progressing && metrics.riskTrend !== "declining") return "improving";
  if (metrics.totalPracticeTasks > 0 && metrics.practiceCompletionRate === 0 && metrics.exposureCompletionCount === 0) return "mixed";
  return "stable";
}

/** Deterministic stuck-point hints (the agent refines/expands these). */
export function detectStuckPoints(events: HealingEventLite[], metrics: ProgressMetrics): { stuckPoint: string; possibleReason: string; recommendedSkill: string }[] {
  const out: { stuckPoint: string; possibleReason: string; recommendedSkill: string }[] = [];
  if (metrics.totalPracticeTasks > 0 && metrics.completedPracticeTasks === 0) out.push({ stuckPoint: "练习创建了但未完成", possibleReason: "任务可能太大或难度过高", recommendedSkill: "cbt" });
  const exposurePlans = events.filter((e) => e.module === "exposure" && e.type === "ExposurePlanCreated").length;
  if (exposurePlans > 0 && metrics.exposureCompletionCount === 0) out.push({ stuckPoint: "暴露计划已建但未开始", possibleReason: "第一步可能仍然太难", recommendedSkill: "exposure" });
  if (metrics.riskTrend === "declining") out.push({ stuckPoint: "风险在升高", possibleReason: "可能需要先稳定与求助", recommendedSkill: "stabilization" });
  return out;
}
