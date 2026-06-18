// ───────────────────── Healing OS · Mental-state intake ─────────────────────
// Structured snapshot of the user's CURRENT state — not a diagnosis. Feeds the
// Dilts/5P formulation and the next-skill recommender. Pure Zod + types.

import { z } from "zod";

const score10 = z.number().min(0).max(10);
const impact = z.enum(["none", "mild", "moderate", "severe"]);
export type ImpactLevel = z.infer<typeof impact>;

/** The recurring loops the intake engine can name. Shared with the detector and
 *  tests so the vocabulary stays closed. */
export const MAINTAINING_LOOPS = [
  "anxiety_avoidance",
  "perfectionism_procrastination",
  "shame_hiding",
  "depression_inactivity",
  "people_pleasing_resentment",
  "control_anxiety",
  "rumination_paralysis",
] as const;
export type MaintainingLoopKind = (typeof MAINTAINING_LOOPS)[number];

/** Skills the intake can route to next (kebab-case keys used across the OS). */
export const NEXT_SKILLS = [
  "dilts-map",
  "case-formulation",
  "core-belief",
  "cbt",
  "emotion-regulation",
  "behavioral-activation",
  "exposure",
  "parts-work",
  "identity-reconstruction",
  "stabilization",
] as const;
export type NextSkill = (typeof NEXT_SKILLS)[number];

export const MentalStateIntakeInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  freeText: z.string().optional(),
  ratings: z
    .object({
      mood: score10.optional(),
      anxiety: score10.optional(),
      sadness: score10.optional(),
      anger: score10.optional(),
      shame: score10.optional(),
      energy: score10.optional(),
      sleepQuality: score10.optional(),
      concentration: score10.optional(),
      functioning: score10.optional(),
    })
    .optional(),
  checkboxes: z
    .object({
      sleepProblem: z.boolean().optional(),
      appetiteChange: z.boolean().optional(),
      panicLikeSymptoms: z.boolean().optional(),
      avoidance: z.boolean().optional(),
      rumination: z.boolean().optional(),
      conflict: z.boolean().optional(),
      procrastination: z.boolean().optional(),
      loneliness: z.boolean().optional(),
      numbness: z.boolean().optional(),
    })
    .optional(),
});
export type MentalStateIntakeInput = z.infer<typeof MentalStateIntakeInputSchema>;
export type IntakeRatings = NonNullable<MentalStateIntakeInput["ratings"]>;
export type IntakeCheckboxes = NonNullable<MentalStateIntakeInput["checkboxes"]>;

export const MaintainingLoopSchema = z.object({
  loopName: z.string(),
  kind: z.enum(MAINTAINING_LOOPS).optional(),
  description: z.string(),
  shortTermReward: z.string(),
  longTermCost: z.string(),
});
export type MaintainingLoop = z.infer<typeof MaintainingLoopSchema>;

export const MentalStateIntakeOutputSchema = z.object({
  summary: z.string(),
  primaryConcerns: z
    .array(
      z.object({
        concern: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        evidence: z.string(),
      }),
    )
    .default([]),
  emotionalProfile: z.object({
    dominantEmotions: z.array(z.string()).default([]),
    intensityPattern: z.string().default(""),
    bodySignals: z.array(z.string()).default([]),
  }),
  functionalImpact: z.object({
    workOrStudy: impact,
    relationships: impact,
    selfCare: impact,
    sleep: impact,
  }),
  likelyMaintainingLoops: z.array(MaintainingLoopSchema).default([]),
  suggestedNextSkills: z.array(z.enum(NEXT_SKILLS)).default([]),
});
export type MentalStateIntakeOutput = z.infer<typeof MentalStateIntakeOutputSchema>;
