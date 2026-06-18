// ─────────────── Healing OS · Dilts map + 5P clinical formulation ───────────────
// The core differentiator: map a psychological problem onto Dilts' six logical
// levels (Environment → Behavior → Capability → Beliefs/Values → Identity →
// Mission) and a 5P case formulation, then a causal loop the UI can draw. NOT a
// diagnosis — capability gaps are framed as trainable skills, inferred history
// is hedged. Pure Zod + types.

import { z } from "zod";

/** Dilts' six logical levels, bottom-up (the order the canvas stacks them). */
export const DILTS_LEVELS = [
  "environment",
  "behavior",
  "capability",
  "beliefAndValues",
  "identity",
  "mission",
] as const;
export type DiltsLevel = (typeof DILTS_LEVELS)[number];

export const BELIEF_TYPES = [
  "core_belief",
  "conditional_belief",
  "rule",
  "value_conflict",
  "assumption",
] as const;
export type BeliefType = (typeof BELIEF_TYPES)[number];

/** Depth gate. Orange risk → "shallow" only (stabilization-oriented). */
export const FORMULATION_DEPTHS = ["light", "standard", "deep", "shallow"] as const;
export type FormulationDepth = (typeof FORMULATION_DEPTHS)[number];

export const DiltsClinicalFormulationInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  problemStatement: z.string().min(1),
  intakeId: z.string().optional(),
  context: z.object({
    safetyRiskLevel: z.enum(["green", "yellow", "orange", "red"]),
    primaryConcerns: z.array(z.string()).optional(),
    dominantEmotions: z.array(z.string()).optional(),
    maintainingLoops: z.array(z.string()).optional(),
  }),
  userPreferences: z
    .object({
      depth: z.enum(["light", "standard", "deep"]).default("standard"),
      includeSpiritualMeaning: z.boolean().default(false),
      language: z.enum(["zh", "en"]).default("zh"),
    })
    .optional(),
});
export type DiltsClinicalFormulationInput = z.infer<typeof DiltsClinicalFormulationInputSchema>;

// ── Per-level shapes ──
const EnvironmentItem = z.object({ item: z.string(), evidence: z.string() });
const BehaviorItem = z.object({
  item: z.string(),
  evidence: z.string(),
  shortTermFunction: z.string(),
  longTermCost: z.string(),
});
const CapabilityItem = z.object({
  item: z.string(),
  currentGap: z.string(),
  trainableSkill: z.string(),
});
const BeliefItem = z.object({
  belief: z.string(),
  type: z.enum(BELIEF_TYPES),
  evidence: z.string(),
  possibleOrigin: z.string().optional(),
  impact: z.string(),
});
const IdentityItem = z.object({
  narrative: z.string(),
  evidence: z.string(),
  cost: z.string(),
  alternativeIdentitySeed: z.string(),
});
const MissionItem = z.object({
  blockedCalling: z.string(),
  fear: z.string(),
  growthDirection: z.string(),
});

export const DiltsMapSchema = z.object({
  environment: z.array(EnvironmentItem).default([]),
  behavior: z.array(BehaviorItem).default([]),
  capability: z.array(CapabilityItem).default([]),
  beliefAndValues: z.array(BeliefItem).default([]),
  identity: z.array(IdentityItem).default([]),
  mission: z.array(MissionItem).default([]),
});
export type DiltsMap = z.infer<typeof DiltsMapSchema>;

export const FivePSchema = z.object({
  presentingProblems: z.array(z.string()).default([]),
  predisposingFactors: z.array(z.string()).default([]),
  precipitatingFactors: z.array(z.string()).default([]),
  perpetuatingFactors: z.array(z.string()).default([]),
  protectiveFactors: z.array(z.string()).min(1), // always surface a resource
});
export type FiveP = z.infer<typeof FivePSchema>;

export const CausalLoopEdgeSchema = z.object({
  from: z.string(),
  relation: z.string(),
  to: z.string(),
  explanation: z.string(),
});
export type CausalLoopEdge = z.infer<typeof CausalLoopEdgeSchema>;

export const InterventionStepSchema = z.object({
  order: z.number().int(),
  skill: z.string(),
  reason: z.string(),
});
export type InterventionStep = z.infer<typeof InterventionStepSchema>;

export const DiltsClinicalFormulationOutputSchema = z.object({
  diltsMap: DiltsMapSchema,
  fiveP: FivePSchema,
  causalLoop: z.array(CausalLoopEdgeSchema).default([]),
  formulationSummary: z.string(),
  recommendedInterventionPath: z.array(InterventionStepSchema).default([]),
  cautions: z.array(z.string()).default([]),
});
export type DiltsClinicalFormulationOutput = z.infer<typeof DiltsClinicalFormulationOutputSchema>;

/** What the LLM emits — orchestration appends the causal loop + intervention path
 *  + cautions deterministically so they're always present and consistent. */
export const DiltsCoreSchema = z.object({
  diltsMap: DiltsMapSchema,
  fiveP: FivePSchema,
  formulationSummary: z.string(),
});
export type DiltsCore = z.infer<typeof DiltsCoreSchema>;
