// ───────────────────── Healing OS · Core belief reconstruction ─────────────────────
// Identify the user's underlying beliefs and reconstruct them into believable,
// TESTABLE new beliefs (not toxic positivity), each with a small behavioral
// experiment. Pure Zod + types.

import { z } from "zod";

export const BELIEF_TYPES = [
  "core_belief",
  "conditional_belief",
  "rule_belief",
  "identity_belief",
  "world_belief",
  "relationship_belief",
  "value_conflict",
  "protective_assumption",
] as const;
export type BeliefType = (typeof BELIEF_TYPES)[number];

export const BELIEF_NEXT_SKILLS = [
  "cbt",
  "emotion-regulation",
  "exposure",
  "parts-work",
  "identity-reconstruction",
  "behavioral-activation",
] as const;
export type BeliefNextSkill = (typeof BELIEF_NEXT_SKILLS)[number];

export const CoreBeliefInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  problemStatement: z.string().min(1),
  formulationId: z.string().optional(),
  intakeId: z.string().optional(),
  diltsContext: z
    .object({
      behaviors: z.array(z.string()).optional(),
      beliefs: z.array(z.string()).optional(),
      identities: z.array(z.string()).optional(),
    })
    .optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  preferences: z.object({ depth: z.enum(["light", "standard", "deep"]).default("standard"), language: z.enum(["zh", "en"]).default("zh") }).optional(),
});
export type CoreBeliefInput = z.infer<typeof CoreBeliefInputSchema>;

const ExtractedBelief = z.object({
  belief: z.string(),
  type: z.enum(BELIEF_TYPES),
  evidence: z.string(),
  emotionalImpact: z.array(z.string()).default([]),
  behavioralImpact: z.array(z.string()).default([]),
  identityImpact: z.string().default(""),
  protectionFunction: z.string(),
  longTermCost: z.string(),
  confidence: z.number().min(0).max(1).default(0.5),
});

const ReconstructedBelief = z.object({
  oldBelief: z.string(),
  newBelief: z.string(),
  whyMoreBalanced: z.string(),
  evidenceForNewBelief: z.array(z.string()).default([]),
  smallPractice: z.string(),
});

const BehavioralExperiment = z.object({
  experimentName: z.string(),
  targetOldBelief: z.string(),
  newBeliefToTest: z.string(),
  actionStep: z.string(),
  predictedFear: z.string(),
  measurableOutcome: z.string(),
  reflectionQuestions: z.array(z.string()).default([]),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
});

const IdentitySeed = z.object({
  oldIdentityNarrative: z.string(),
  newIdentitySeed: z.string(),
  dailyEvidenceAction: z.string(),
});

/** What the LLM emits — service appends nextRecommendedSkills + cautions. */
export const CoreBeliefCoreSchema = z.object({
  extractedBeliefs: z.array(ExtractedBelief).min(1),
  primaryBeliefPattern: z.object({
    name: z.string(),
    summary: z.string(),
    oldLoop: z.string(),
    keyFear: z.string(),
    keyProtection: z.string(),
    keyCost: z.string(),
  }),
  reconstructedBeliefs: z.array(ReconstructedBelief).default([]),
  behavioralExperiments: z.array(BehavioralExperiment).default([]),
  identitySeeds: z.array(IdentitySeed).default([]),
});
export type CoreBeliefCore = z.infer<typeof CoreBeliefCoreSchema>;

export const CoreBeliefOutputSchema = CoreBeliefCoreSchema.extend({
  cautions: z.array(z.string()).default([]),
  nextRecommendedSkills: z.array(z.enum(BELIEF_NEXT_SKILLS)).default([]),
});
export type CoreBeliefOutput = z.infer<typeof CoreBeliefOutputSchema>;
