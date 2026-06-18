// ───────────────────── Healing OS · Journey timeline & progress ─────────────────────
// Aggregates the whole journey (from Healing:* DomainEvents + PracticeTask
// stats) into progress metrics + a non-exaggerated report. Metrics are computed
// deterministically; the LLM only writes the narrative.
import { z } from "zod";

export const OVERALL_DIRECTIONS = ["improving", "stable", "mixed", "declining", "insufficient_data"] as const;
export type OverallDirection = (typeof OVERALL_DIRECTIONS)[number];

export const TIMELINE_EVENT_TYPES = [
  "safety_event", "intake", "formulation", "belief_reconstruction", "cbt_session", "emotion_regulation",
  "stabilization", "parts_work", "exposure_plan", "exposure_attempt", "identity_reconstruction",
  "identity_evidence", "practice_created", "practice_completed", "relapse_signal",
] as const;
export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number];

export const HealingTimelineInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().optional(),
  timeRange: z.object({ from: z.string(), to: z.string() }),
  reportMode: z.enum(["daily", "weekly", "monthly", "full_journey", "pattern_analysis"]).default("weekly"),
});
export type HealingTimelineInput = z.infer<typeof HealingTimelineInputSchema>;

export const ProgressMetricsSchema = z.object({
  practiceCompletionRate: z.number().min(0).max(1),
  exposureCompletionCount: z.number().int(),
  identityEvidenceCount: z.number().int(),
  riskTrend: z.string(),
  avoidanceTrend: z.string(),
  totalSessions: z.number().int(),
  totalPracticeTasks: z.number().int(),
  completedPracticeTasks: z.number().int(),
});
export type ProgressMetrics = z.infer<typeof ProgressMetricsSchema>;

export const TimelineEventSchema = z.object({
  date: z.string(),
  eventType: z.enum(TIMELINE_EVENT_TYPES),
  title: z.string(),
  significance: z.enum(["low", "medium", "high"]).default("low"),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

/** The LLM writes this narrative layer from the computed metrics + events. */
export const TimelineNarrativeSchema = z.object({
  summaryText: z.string(),
  patternChanges: z.array(z.object({ patternName: z.string(), previousExpression: z.string(), currentExpression: z.string(), evidenceOfChange: z.array(z.string()).default([]), remainingChallenge: z.string().default("") })).default([]),
  growthEvidence: z.array(z.object({ evidence: z.string(), source: z.string().default(""), identityMeaning: z.string().default("") })).default([]),
  stuckPoints: z.array(z.object({ stuckPoint: z.string(), possibleReason: z.string().default(""), recommendedSkill: z.string().default("") })).default([]),
  nextStepRecommendations: z.array(z.object({ priority: z.number().int(), recommendation: z.string(), relatedSkill: z.string().default(""), reason: z.string().default("") })).default([]),
  userFacingWeeklyReport: z.string(),
});
export type TimelineNarrative = z.infer<typeof TimelineNarrativeSchema>;

export const HealingTimelineOutputSchema = z.object({
  timelineSummary: z.object({ timeRange: z.string(), overallDirection: z.enum(OVERALL_DIRECTIONS), summaryText: z.string() }),
  timelineEvents: z.array(TimelineEventSchema).default([]),
  progressMetrics: ProgressMetricsSchema,
  patternChanges: TimelineNarrativeSchema.shape.patternChanges,
  growthEvidence: TimelineNarrativeSchema.shape.growthEvidence,
  stuckPoints: TimelineNarrativeSchema.shape.stuckPoints,
  nextStepRecommendations: TimelineNarrativeSchema.shape.nextStepRecommendations,
  userFacingWeeklyReport: z.string(),
});
export type HealingTimelineOutput = z.infer<typeof HealingTimelineOutputSchema>;
