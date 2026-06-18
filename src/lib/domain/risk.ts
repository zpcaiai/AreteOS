// ───────────────────────── Healing OS · Risk domain ─────────────────────────
// Safety-triage vocabulary + I/O schemas. This is the SAFETY GATE for the whole
// Healing OS: every deeper engine (intake, Dilts map, formulation, exposure,
// identity work) runs only after triage clears it. Pure types + Zod — no LLM,
// no Prisma — so the rule engine and tests can import it on the edge.

import { z } from "zod";

/** Severity ladder. Monotonic: triage may ESCALATE but never de-escalate. */
export const RISK_LEVELS = ["green", "yellow", "orange", "red"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/** Numeric rank so overrides can take the max of two levels. */
export const RISK_RANK: Record<RiskLevel, number> = { green: 0, yellow: 1, orange: 2, red: 3 };

export const riskAtLeast = (a: RiskLevel, b: RiskLevel): RiskLevel =>
  RISK_RANK[a] >= RISK_RANK[b] ? a : b;

export const RISK_DOMAINS = [
  "self_harm",
  "suicide",
  "harm_to_others",
  "psychosis",
  "mania",
  "severe_dissociation",
  "domestic_violence",
  "substance_withdrawal",
  "eating_disorder",
  "medical_emergency",
  "none",
] as const;
export type RiskDomain = (typeof RISK_DOMAINS)[number];

export const RECOMMENDED_ROUTES = [
  "continue_normal_flow",
  "use_supportive_response",
  "use_stabilization_protocol",
  "suggest_professional_support",
  "urgent_crisis_response",
] as const;
export type RecommendedRoute = (typeof RECOMMENDED_ROUTES)[number];

/** Deep engines that MUST NOT run while risk is orange/red. Kept here so the
 *  rule engine, the services, and tests share one source of truth. */
export const DEEP_SKILLS_BLOCKED_ON_RISK = [
  "dilts-map",
  "core-belief",
  "deep-belief-regression",
  "trauma-processing",
  "exposure",
  "identity-reconstruction",
] as const;

/** Skills that remain available in a crisis — stabilization only. */
export const CRISIS_SAFE_SKILLS = [
  "crisis-stabilization",
  "support-contact-generation",
  "grounding",
] as const;

// ───────────────────────────── I/O schemas ─────────────────────────────

export const SafetyTriageInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  message: z.string().min(1),
  context: z
    .object({
      previousRiskLevel: z.enum(RISK_LEVELS).optional(),
      recentMoodScore: z.number().min(0).max(10).optional(),
      recentSleepHours: z.number().min(0).max(24).optional(),
      hasKnownCrisisHistory: z.boolean().optional(),
      locale: z.string().default("zh-CN"),
    })
    .optional(),
});
export type SafetyTriageInput = z.infer<typeof SafetyTriageInputSchema>;

export const DetectedSignalSchema = z.object({
  signal: z.string(),
  evidence: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});
export type DetectedSignal = z.infer<typeof DetectedSignalSchema>;

export const SafetyPlanSchema = z.object({
  immediateSteps: z.array(z.string()).default([]),
  supportContactsPrompt: z.string().optional(),
  groundingExercise: z.string().optional(),
  professionalHelpRecommendation: z.string().optional(),
});
export type SafetyPlan = z.infer<typeof SafetyPlanSchema>;

export const SafetyTriageOutputSchema = z.object({
  riskLevel: z.enum(RISK_LEVELS),
  riskDomains: z.array(z.enum(RISK_DOMAINS)).min(1),
  confidence: z.number().min(0).max(1),
  detectedSignals: z.array(DetectedSignalSchema).default([]),
  recommendedRoute: z.enum(RECOMMENDED_ROUTES),
  userFacingMessage: z.string(),
  allowedNextSkills: z.array(z.string()).default([]),
  blockedSkills: z.array(z.string()).default([]),
  safetyPlan: SafetyPlanSchema.optional(),
});
export type SafetyTriageOutput = z.infer<typeof SafetyTriageOutputSchema>;

/** Subset the LLM is asked to emit — orchestration adds routing/skills/plan so
 *  the model can never *lower* a rule-determined risk. */
export const SafetyClassificationSchema = z.object({
  riskLevel: z.enum(RISK_LEVELS),
  riskDomains: z.array(z.enum(RISK_DOMAINS)).min(1),
  confidence: z.number().min(0).max(1),
  detectedSignals: z.array(DetectedSignalSchema).default([]),
});
export type SafetyClassification = z.infer<typeof SafetyClassificationSchema>;

/** Route + UI policy derived deterministically from a (possibly overridden) level. */
export const ROUTE_FOR_LEVEL: Record<RiskLevel, RecommendedRoute> = {
  green: "continue_normal_flow",
  yellow: "use_supportive_response",
  orange: "use_stabilization_protocol",
  red: "urgent_crisis_response",
};
