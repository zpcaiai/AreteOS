// ───────────────────── Healing OS · Parts work (inner family) ─────────────────────
// Parts-work-STYLE self-awareness and inner negotiation. Not IFS therapy. Never
// implies DID / multiple personality. Never excavates trauma. Builds a Healthy
// Adult that understands each part's protective intent.
import { z } from "zod";

export const INNER_PART_TYPES = [
  "inner_critic",
  "people_pleaser",
  "perfectionist",
  "controller",
  "avoider",
  "protector",
  "wounded_child",
  "angry_part",
  "numb_part",
  "striving_part",
  "fearful_part",
  "rebellious_part",
  "healthy_adult",
  "wise_self",
  "unknown",
] as const;
export type InnerPartType = (typeof INNER_PART_TYPES)[number];

export const PARTS_MODES = ["parts_mapping", "inner_dialogue", "protector_understanding", "inner_critic_softening", "healthy_adult_response", "light_parts_checkin"] as const;
export type PartsMode = (typeof PARTS_MODES)[number];

export const PARTS_NEXT_SKILLS = ["emotion-regulation", "core-belief", "cbt", "exposure", "identity-reconstruction", "stabilization"] as const;
export type PartsNextSkill = (typeof PARTS_NEXT_SKILLS)[number];

export const PartsWorkInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  currentConflict: z.string().min(1),
  relatedFormulationId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  knownPatterns: z.object({ coreBeliefs: z.array(z.string()).optional(), identityNarratives: z.array(z.string()).optional(), behaviors: z.array(z.string()).optional(), emotions: z.array(z.string()).optional() }).optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  mode: z.enum(PARTS_MODES).default("parts_mapping"),
});
export type PartsWorkInput = z.infer<typeof PartsWorkInputSchema>;

export const PartsWorkCoreSchema = z.object({
  partsMap: z
    .array(
      z.object({
        partName: z.string(),
        partType: z.enum(INNER_PART_TYPES),
        voice: z.string(),
        emotion: z.string(),
        urge: z.string(),
        protectionGoal: z.string(),
        fearIfNotProtected: z.string(),
        costOfExtremeStrategy: z.string(),
        whatItNeeds: z.string(),
      }),
    )
    .min(1),
  internalConflictSummary: z.object({ conflictPattern: z.string(), polarizedParts: z.array(z.string()).default([]), sharedPositiveIntention: z.string(), mainRisk: z.string() }),
  healthyAdultResponse: z.object({
    stance: z.string(),
    validationForEachPart: z.array(z.object({ partName: z.string(), validation: z.string(), boundary: z.string(), newRoleInvitation: z.string() })).default([]),
    integrativeStatement: z.string(),
  }),
  innerDialogueScript: z.array(z.object({ speaker: z.string(), line: z.string() })).default([]),
  practiceTask: z.object({ title: z.string(), steps: z.array(z.string()).default([]), duration: z.string().default(""), safetyStopRule: z.string().default("") }),
});
export type PartsWorkCore = z.infer<typeof PartsWorkCoreSchema>;

export const PartsWorkOutputSchema = PartsWorkCoreSchema.extend({
  nextRecommendedSkills: z.array(z.enum(PARTS_NEXT_SKILLS)).default([]),
  cautions: z.array(z.string()).default([]),
});
export type PartsWorkOutput = z.infer<typeof PartsWorkOutputSchema>;
