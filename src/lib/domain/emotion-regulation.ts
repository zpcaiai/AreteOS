// ───────────────────── Healing OS · Emotion regulation (DBT/ACT) ─────────────────────
import { z } from "zod";

export const AROUSAL_STATES = ["hyperarousal", "within_window", "hypoarousal", "mixed", "unclear"] as const;
export type ArousalState = (typeof AROUSAL_STATES)[number];

export const ER_MODES = [
  "quick_stabilization",
  "dbt_distress_tolerance",
  "dbt_emotion_regulation",
  "act_defusion",
  "act_values_action",
  "interpersonal_effectiveness",
  "body_grounding",
] as const;
export type EmotionRegulationMode = (typeof ER_MODES)[number];

export const ER_SKILLS = [
  "grounding_5_4_3_2_1",
  "paced_breathing",
  "cold_water_reset",
  "urge_surfing",
  "opposite_action",
  "check_the_facts",
  "self_validation",
  "cognitive_defusion",
  "values_micro_action",
  "dear_man",
  "radical_acceptance",
  "body_scan",
] as const;
export type ERSkill = (typeof ER_SKILLS)[number];

export const ER_NEXT_SKILLS = ["cbt", "core-belief", "exposure", "parts-work", "identity-reconstruction", "relapse-prevention"] as const;
export type ERNextSkill = (typeof ER_NEXT_SKILLS)[number];

export const EmotionRegulationInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  currentEmotionText: z.string().min(1),
  emotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10) })).optional(),
  bodySignals: z.array(z.string()).optional(),
  urges: z.array(z.string()).optional(),
  context: z.object({ trigger: z.string().optional(), recentSleepHours: z.number().min(0).max(24).optional() }).optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  preferredMode: z.enum(ER_MODES).optional(),
});
export type EmotionRegulationInput = z.infer<typeof EmotionRegulationInputSchema>;

export const EmotionRegulationCoreSchema = z.object({
  emotionalStateMap: z.object({
    dominantEmotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10), likelyFunction: z.string().default(""), associatedUrge: z.string().default("") })).default([]),
    arousalState: z.enum(AROUSAL_STATES),
    bodySignals: z.array(z.string()).default([]),
    triggerSummary: z.string().default(""),
    immediateRiskNotes: z.array(z.string()).default([]),
  }),
  recommendedSkillSet: z.object({
    primarySkill: z.enum(ER_SKILLS),
    reason: z.string(),
    contraindications: z.array(z.string()).default([]),
  }),
  interventionPlan: z.object({
    sixtySecondVersion: z.array(z.string()).min(1),
    fiveMinuteVersion: z.array(z.string()).default([]),
    twentyMinuteVersion: z.array(z.string()).default([]),
  }),
  actProcess: z
    .object({ painfulThoughtOrFeeling: z.string(), defusionPhrase: z.string(), acceptedExperience: z.string(), chosenValue: z.string(), committedMicroAction: z.string() })
    .optional(),
  dbtProcess: z
    .object({ validationStatement: z.string(), emotionName: z.string(), factCheckQuestion: z.string(), oppositeActionSuggestion: z.string().optional(), distressToleranceStep: z.string().optional() })
    .optional(),
  practiceTask: z.object({ title: z.string(), steps: z.array(z.string()).default([]), suggestedTiming: z.string().default(""), completionMetric: z.string().default("") }),
  reflectionQuestions: z.array(z.string()).default([]),
});
export type EmotionRegulationCore = z.infer<typeof EmotionRegulationCoreSchema>;

export const EmotionRegulationOutputSchema = EmotionRegulationCoreSchema.extend({
  nextRecommendedSkills: z.array(z.enum(ER_NEXT_SKILLS)).default([]),
});
export type EmotionRegulationOutput = z.infer<typeof EmotionRegulationOutputSchema>;
