// ───────────────────── Healing OS · CBT behavioral change ─────────────────────
import { z } from "zod";
import { COGNITIVE_DISTORTIONS } from "./cognitive-distortions";

export const CBT_MODES = [
  "thought_record",
  "cognitive_reframe",
  "behavioral_experiment",
  "behavioral_activation",
  "procrastination_breakdown",
  "rumination_interrupt",
] as const;
export type CBTMode = (typeof CBT_MODES)[number];

export const CBT_NEXT_SKILLS = ["core-belief", "emotion-regulation", "exposure", "identity-reconstruction", "parts-work"] as const;
export type CBTNextSkill = (typeof CBT_NEXT_SKILLS)[number];

export const CBTInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  situation: z.string().min(1),
  relatedBeliefRecordId: z.string().optional(),
  formulationId: z.string().optional(),
  currentState: z
    .object({
      emotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10) })).optional(),
      bodySensations: z.array(z.string()).optional(),
      urges: z.array(z.string()).optional(),
      currentBehavior: z.string().optional(),
    })
    .optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  mode: z.enum(CBT_MODES).default("thought_record"),
});
export type CBTInput = z.infer<typeof CBTInputSchema>;

export const CBTCoreSchema = z.object({
  cbtMap: z.object({
    situation: z.string(),
    automaticThoughts: z.array(z.object({ thought: z.string(), emotionTriggered: z.array(z.string()).default([]), confidence: z.number().min(0).max(1).default(0.5) })).default([]),
    emotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10), function: z.string().default("") })).default([]),
    behaviors: z.array(z.object({ behavior: z.string(), shortTermReward: z.string(), longTermCost: z.string() })).default([]),
    outcomeLoop: z.string().default(""),
  }),
  cognitiveDistortions: z.array(z.object({ distortion: z.enum(COGNITIVE_DISTORTIONS), evidence: z.string(), reframeQuestion: z.string() })).default([]),
  evidenceCheck: z.object({
    evidenceFor: z.array(z.string()).default([]),
    evidenceAgainst: z.array(z.string()).default([]),
    missingInformation: z.array(z.string()).default([]),
    moreBalancedView: z.string().default(""),
  }),
  alternativeThoughts: z.array(z.object({ oldThought: z.string(), alternativeThought: z.string(), practicePrompt: z.string().default("") })).default([]),
  behaviorPlan: z.object({
    planType: z.enum(["behavioral_experiment", "behavioral_activation", "exposure_step", "task_breakdown", "rumination_interrupt"]),
    title: z.string(),
    steps: z.array(z.string()).default([]),
    difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
    expectedObstacle: z.string().default(""),
    copingPlan: z.string().default(""),
    measurement: z.string().default(""),
  }),
  reflectionQuestions: z.array(z.string()).default([]),
});
export type CBTCore = z.infer<typeof CBTCoreSchema>;

export const CBTOutputSchema = CBTCoreSchema.extend({
  nextRecommendedSkills: z.array(z.enum(CBT_NEXT_SKILLS)).default([]),
});
export type CBTOutput = z.infer<typeof CBTOutputSchema>;
