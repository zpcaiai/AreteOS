// ───────────────────── Healing OS · Relapse prevention & maintenance ─────────────────────
// Treats relapse as a SIGNAL, not failure. Builds early-warning signals, if-then
// plans, 24h/7d/30d recovery protocols, support + identity maintenance. No
// shame-based language, no cure claims, no diagnosis.
import { z } from "zod";

export const RELAPSE_MODES = ["create_plan", "update_plan", "early_warning_check", "relapse_response", "maintenance_review"] as const;
export type RelapseMode = (typeof RELAPSE_MODES)[number];

export const RELAPSE_PLAN_SKILLS = ["safety", "stabilization", "emotion-regulation", "cbt", "parts-work", "exposure", "identity-evidence", "support-contact"] as const;
export const RELAPSE_NEXT_SKILLS = ["safety", "stabilization", "emotion-regulation", "cbt", "parts-work", "exposure", "identity", "timeline"] as const;
export type RelapseNextSkill = (typeof RELAPSE_NEXT_SKILLS)[number];

export const RelapseSignalsSchema = z.object({
  sleepWorse: z.boolean().optional(),
  avoidanceIncreased: z.boolean().optional(),
  ruminationIncreased: z.boolean().optional(),
  emotionalIntensityIncreased: z.boolean().optional(),
  practiceStopped: z.boolean().optional(),
  socialWithdrawal: z.boolean().optional(),
  oldBeliefReturned: z.boolean().optional(),
  riskLevelIncreased: z.boolean().optional(),
});
export type RelapseSignals = z.infer<typeof RelapseSignalsSchema>;

export const RelapsePreventionInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().optional(),
  currentConcern: z.string().optional(),
  knownPatterns: z.object({ oldLoops: z.array(z.string()).optional(), coreBeliefs: z.array(z.string()).optional(), avoidanceBehaviors: z.array(z.string()).optional(), emotionalTriggers: z.array(z.string()).optional() }).optional(),
  recentSignals: RelapseSignalsSchema.optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  mode: z.enum(RELAPSE_MODES).default("create_plan"),
});
export type RelapsePreventionInput = z.infer<typeof RelapsePreventionInputSchema>;

export const RelapsePreventionCoreSchema = z.object({
  relapseRiskMap: z.object({
    riskLevel: z.enum(["low", "moderate", "high", "urgent"]),
    mainTriggers: z.array(z.string()).default([]),
    earlyWarningSignals: z.array(z.object({ signal: z.string(), meaning: z.string(), recommendedResponse: z.string() })).default([]),
    oldPatternScripts: z.array(z.object({ patternName: z.string(), sequence: z.array(z.string()).default([]), interruptionPoint: z.string() })).default([]),
  }),
  ifThenPlans: z.array(z.object({ ifSignal: z.string(), thenAction: z.string(), relatedSkill: z.enum(RELAPSE_PLAN_SKILLS), difficulty: z.enum(["easy", "medium", "hard"]).default("easy") })).default([]),
  recoveryProtocol: z.object({ twentyFourHourPlan: z.array(z.string()).default([]), sevenDayPlan: z.array(z.string()).default([]), thirtyDayMaintenancePlan: z.array(z.string()).default([]) }),
  supportSystemPlan: z.object({ selfSupportActions: z.array(z.string()).default([]), safePeopleToContactPrompt: z.string().default(""), professionalSupportRecommendation: z.string().default(""), messageTemplates: z.array(z.object({ situation: z.string(), message: z.string() })).default([]) }),
  identityMaintenance: z.object({ oldIdentityWarning: z.string(), newIdentityReminder: z.string(), minimumEvidenceAction: z.string(), repairStatement: z.string() }),
  practiceMaintenancePlan: z.object({ minimumDailyPractice: z.string(), weeklyReviewQuestions: z.array(z.string()).default([]), fallbackWhenLowEnergy: z.string() }),
  relapseReviewTemplate: z.object({ whatHappened: z.string(), whatTriggeredIt: z.string(), whatOldPatternAppeared: z.string(), whatHelpedEvenALittle: z.string(), whatToTryNextTime: z.string() }),
});
export type RelapsePreventionCore = z.infer<typeof RelapsePreventionCoreSchema>;

export const RelapsePreventionOutputSchema = RelapsePreventionCoreSchema.extend({
  nextRecommendedSkills: z.array(z.enum(RELAPSE_NEXT_SKILLS)).default([]),
  cautions: z.array(z.string()).default([]),
});
export type RelapsePreventionOutput = z.infer<typeof RelapsePreventionOutputSchema>;

export const RelapseCheckInInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().optional(),
  planId: z.string().optional(),
  signals: RelapseSignalsSchema,
  actionTaken: z.array(z.string()).optional(),
  userReflection: z.string().optional(),
});
export type RelapseCheckInInput = z.infer<typeof RelapseCheckInInputSchema>;
