// ───────────────────── Healing OS · Avoidance & graded exposure ─────────────────────
// Self-help graded exposure for LOW-RISK avoidance (social/expression/boundary/
// task/imperfection/uncertainty). NEVER trauma exposure, dangerous real-world
// tasks, OCD-ERP substitution, or forced escalation. First experiment ≤ medium;
// auto-generated difficulty capped. (NICE social-anxiety CBT frame; treatment by
// trained professionals stays out of scope.)
import { z } from "zod";

export const EXPOSURE_TYPES = [
  "social_expression",
  "assertiveness_boundary",
  "task_initiation",
  "imperfection_practice",
  "uncertainty_tolerance",
  "relationship_approach",
  "performance_anxiety",
  "conflict_tolerance",
  "avoidance_reversal",
  "custom",
] as const;
export type ExposureType = (typeof EXPOSURE_TYPES)[number];

export const EXPOSURE_NEXT_SKILLS = ["emotion-regulation", "cbt", "core-belief", "parts-work", "identity-reconstruction", "relapse-prevention"] as const;
export type ExposureNextSkill = (typeof EXPOSURE_NEXT_SKILLS)[number];

export const ExposureInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  avoidanceProblem: z.string().min(1),
  relatedCBTSessionId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  relatedFormulationId: z.string().optional(),
  fearPrediction: z.string().optional(),
  targetBehavior: z.string().optional(),
  currentAvoidanceBehaviors: z.array(z.string()).optional(),
  safetyBehaviors: z.array(z.string()).optional(),
  distressRating: z.number().min(0).max(10).optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  constraints: z
    .object({ maxDifficulty: z.enum(["easy", "medium", "hard"]).default("medium"), avoidTraumaContent: z.boolean().default(true), userCanStopAnytime: z.boolean().default(true), realWorldSafetyRequired: z.boolean().default(true) })
    .optional(),
});
export type ExposureInput = z.infer<typeof ExposureInputSchema>;

export const ExposureCoreSchema = z.object({
  avoidanceLoop: z.object({
    trigger: z.string(),
    fearPrediction: z.string(),
    emotion: z.string(),
    avoidanceBehavior: z.string(),
    safetyBehaviors: z.array(z.string()).default([]),
    shortTermRelief: z.string(),
    longTermCost: z.string(),
  }),
  exposureType: z.enum(EXPOSURE_TYPES),
  hierarchy: z
    .array(z.object({ level: z.number().int(), title: z.string(), action: z.string(), predictedDistress: z.number().min(0).max(10), difficulty: z.enum(["easy", "medium", "hard"]), safetyNotes: z.string().default(""), successCriteria: z.string() }))
    .min(1),
  selectedExperiment: z.object({
    title: z.string(),
    oldPrediction: z.string(),
    newLearningTarget: z.string(),
    actionSteps: z.array(z.string()).default([]),
    safetyBehaviorToReduce: z.string().optional(),
    duration: z.string().default(""),
    measurement: z.object({ beforeDistress: z.string(), peakDistress: z.string(), afterDistress: z.string(), actualOutcome: z.string(), learningStatement: z.string() }),
    stopRules: z.array(z.string()).default([]),
  }),
  reflectionTemplate: z.object({ beforeQuestions: z.array(z.string()).default([]), duringQuestions: z.array(z.string()).default([]), afterQuestions: z.array(z.string()).default([]) }),
});
export type ExposureCore = z.infer<typeof ExposureCoreSchema>;

export const ExposureOutputSchema = ExposureCoreSchema.extend({
  blocked: z.boolean().default(false),
  blockReason: z.string().optional(),
  nextRecommendedSkills: z.array(z.enum(EXPOSURE_NEXT_SKILLS)).default([]),
  cautions: z.array(z.string()).default([]),
});
export type ExposureOutput = z.infer<typeof ExposureOutputSchema>;

export const ExposureAttemptInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  exposurePlanId: z.string().min(1),
  hierarchyLevel: z.number().int(),
  beforeDistress: z.number().min(0).max(10),
  peakDistress: z.number().min(0).max(10).optional(),
  afterDistress: z.number().min(0).max(10).optional(),
  actualOutcome: z.string().optional(),
  learningStatement: z.string().optional(),
  safetyBehaviorsUsed: z.array(z.string()).optional(),
  completed: z.boolean().default(false),
});
export type ExposureAttemptInput = z.infer<typeof ExposureAttemptInputSchema>;
