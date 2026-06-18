// ───────────────────── Healing OS · Identity reconstruction + mission recovery ─────────────────────
// Move from old identity narratives → believable transition identities →
// grounded new identity seeds → daily evidence actions → mission recovery.
// No grandiosity, no toxic positivity, no diagnosis.
import { z } from "zod";

export const IDENTITY_MODES = ["identity_mapping", "old_to_new_identity", "mission_recovery", "daily_evidence_plan", "light_identity_stabilization"] as const;
export type IdentityMode = (typeof IDENTITY_MODES)[number];

export const IDENTITY_NEXT_SKILLS = ["timeline-progress", "relapse-prevention", "exposure", "cbt", "parts-work", "emotion-regulation"] as const;
export type IdentityNextSkill = (typeof IDENTITY_NEXT_SKILLS)[number];

export const IdentityReconstructionInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  currentIdentityPain: z.string().min(1),
  relatedFormulationId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  knownPatterns: z.object({ oldBeliefs: z.array(z.string()).optional(), oldIdentityNarratives: z.array(z.string()).optional(), successfulPracticeEvidence: z.array(z.string()).optional() }).optional(),
  valuesContext: z.object({ importantValues: z.array(z.string()).optional(), relationshipsThatMatter: z.array(z.string()).optional(), workOrCallingThemes: z.array(z.string()).optional(), spiritualContextEnabled: z.boolean().default(false) }).optional(),
  safetyContext: z.object({ riskLevel: z.enum(["green", "yellow", "orange", "red"]) }),
  mode: z.enum(IDENTITY_MODES).default("identity_mapping"),
});
export type IdentityReconstructionInput = z.infer<typeof IdentityReconstructionInputSchema>;

export const IdentityReconstructionCoreSchema = z.object({
  identityMap: z.object({
    oldIdentityNarratives: z.array(z.object({ narrative: z.string(), evidenceFromUserStory: z.string(), protectionFunction: z.string(), longTermCost: z.string(), linkedBeliefs: z.array(z.string()).default([]), linkedBehaviors: z.array(z.string()).default([]) })).default([]),
    transitionIdentities: z.array(z.object({ oldNarrative: z.string(), transitionIdentity: z.string(), whyThisIsBelievable: z.string(), whatItAllowsUserToDo: z.string() })).default([]),
    newIdentitySeeds: z.array(z.object({ identitySeed: z.string(), groundedEvidence: z.array(z.string()).default([]), requiredPractices: z.array(z.string()).default([]), riskOfOverstatement: z.string().default("") })).default([]),
  }),
  missionRecovery: z.object({
    blockedMissionThemes: z.array(z.string()).default([]),
    avoidedRoles: z.array(z.string()).default([]),
    valuesToRecover: z.array(z.string()).default([]),
    relationshipDirection: z.string().default(""),
    workOrCreationDirection: z.string().default(""),
    serviceOrContributionDirection: z.string().default(""),
    spiritualReflection: z.string().optional(),
  }),
  dailyEvidencePlan: z.object({
    identityStatement: z.string(),
    sevenDayEvidenceActions: z.array(z.object({ day: z.number().int(), action: z.string(), evidenceQuestion: z.string(), difficulty: z.enum(["easy", "medium", "hard"]).default("easy") })).default([]),
    minimumViableAction: z.string().default(""),
    fallbackAction: z.string().default(""),
  }),
  identityPracticeTask: z.object({ title: z.string(), description: z.string().default(""), steps: z.array(z.string()).default([]), completionMetric: z.string().default("") }),
  integrationSummary: z.string(),
});
export type IdentityReconstructionCore = z.infer<typeof IdentityReconstructionCoreSchema>;

export const IdentityReconstructionOutputSchema = IdentityReconstructionCoreSchema.extend({
  nextRecommendedSkills: z.array(z.enum(IDENTITY_NEXT_SKILLS)).default([]),
  cautions: z.array(z.string()).default([]),
});
export type IdentityReconstructionOutput = z.infer<typeof IdentityReconstructionOutputSchema>;

export const IdentityEvidenceInputSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  identitySessionId: z.string().optional(),
  identityStatement: z.string().min(1),
  evidenceAction: z.string().min(1),
  userReflection: z.string().optional(),
  evidenceStrength: z.number().min(0).max(10).optional(),
  completed: z.boolean().default(false),
});
export type IdentityEvidenceInput = z.infer<typeof IdentityEvidenceInputSchema>;
