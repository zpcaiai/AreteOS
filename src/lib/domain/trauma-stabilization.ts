// ───────────────────── Healing OS · Trauma-informed stabilization ─────────────────────
// STABILIZATION, not trauma processing. Never asks for trauma detail; never does
// exposure/EMDR/memory regression; never diagnoses PTSD. Returns to the present,
// restores choice, points to support. (SAMHSA safety/choice/collaboration frame.)
import { z } from "zod";
import { AROUSAL_STATES } from "./emotion-regulation";

export const PRESENT_ORIENTATION = ["oriented", "partially_oriented", "disoriented", "unclear"] as const;
export type PresentOrientation = (typeof PRESENT_ORIENTATION)[number];

export const STABILIZATION_PRIORITIES = [
  "urgent_safety",
  "grounding",
  "orienting",
  "down_regulation",
  "up_regulation",
  "support_connection",
  "normal_reflection",
] as const;
export type StabilizationPriority = (typeof STABILIZATION_PRIORITIES)[number];

export const STABILIZATION_MODES = ["grounding", "orienting", "breathing", "body_activation", "container", "safe_place", "support_contact", "flashback_protocol"] as const;
export type StabilizationMode = (typeof STABILIZATION_MODES)[number];

export const STAB_NEXT_SKILLS = ["emotion-regulation", "cbt", "core-belief-light", "parts-work-light", "practice-task", "safety-planning"] as const;
export const STAB_BLOCKED_SKILLS = ["deep-trauma-processing", "exposure", "identity-deep-dive", "memory-regression", "intensive-core-belief"] as const;

export const TraumaStabilizationInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  currentExperience: z.string().min(1),
  symptoms: z
    .object({
      flashback: z.boolean().optional(),
      panic: z.boolean().optional(),
      dissociation: z.boolean().optional(),
      numbness: z.boolean().optional(),
      intrusiveMemory: z.boolean().optional(),
      bodyFreeze: z.boolean().optional(),
      emotionalFlooding: z.boolean().optional(),
      shutdown: z.boolean().optional(),
      urgeToEscape: z.boolean().optional(),
    })
    .optional(),
  bodySignals: z.array(z.string()).optional(),
  orientation: z
    .object({ knowsCurrentDate: z.boolean().optional(), knowsCurrentLocation: z.boolean().optional(), feelsPresent: z.boolean().optional(), feelsSafeEnough: z.boolean().optional() })
    .optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  preferredStabilizationMode: z.enum(STABILIZATION_MODES).optional(),
});
export type TraumaStabilizationInput = z.infer<typeof TraumaStabilizationInputSchema>;

export const TraumaStabilizationCoreSchema = z.object({
  stabilizationAssessment: z.object({
    arousalState: z.enum(AROUSAL_STATES),
    presentOrientation: z.enum(PRESENT_ORIENTATION),
    stabilizationPriority: z.enum(STABILIZATION_PRIORITIES),
    doNotProceedWith: z.array(z.string()).default([]),
  }),
  userFacingValidation: z.string(),
  immediateProtocol: z.object({ title: z.string(), duration: z.string().default(""), steps: z.array(z.string()).min(1), stopSignals: z.array(z.string()).default([]) }),
  groundingPlan: z.object({
    sensoryAnchors: z.array(z.string()).default([]),
    bodyAnchors: z.array(z.string()).default([]),
    environmentAnchors: z.array(z.string()).default([]),
    phraseAnchors: z.array(z.string()).default([]),
  }),
  flashbackPlan: z.object({ recognitionStatement: z.string(), nowVsThenStatement: z.string(), orientingSteps: z.array(z.string()).default([]), aftercareSteps: z.array(z.string()).default([]) }).optional(),
  dissociationPlan: z.object({ signsDetected: z.array(z.string()).default([]), reorientationSteps: z.array(z.string()).default([]), activationSteps: z.array(z.string()).default([]) }).optional(),
  supportPlan: z.object({ recommendedSupportAction: z.string(), messageTemplate: z.string(), professionalSupportNote: z.string() }).optional(),
});
export type TraumaStabilizationCore = z.infer<typeof TraumaStabilizationCoreSchema>;

export const TraumaStabilizationOutputSchema = TraumaStabilizationCoreSchema.extend({
  nextAllowedSkills: z.array(z.enum(STAB_NEXT_SKILLS)).default([]),
  blockedSkills: z.array(z.enum(STAB_BLOCKED_SKILLS)).default([]),
});
export type TraumaStabilizationOutput = z.infer<typeof TraumaStabilizationOutputSchema>;
