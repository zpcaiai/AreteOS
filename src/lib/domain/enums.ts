// Domain enums mirrored from Prisma for use in pure logic + the UI without
// importing the generated client on the edge.

export const EVOLUTION_STAGES = [
  "UNAWARE", "EXPLORER", "BUILDER", "OPERATOR",
  "STRATEGIST", "CREATOR", "LEADER", "LEGACY_BUILDER",
] as const;
export type EvolutionStage = (typeof EVOLUTION_STAGES)[number];

export const DEV_LAYERS = [
  "WORLDVIEW", "MISSION", "IDENTITY", "VALUES", "MENTAL_MODELS", "FIRST_PRINCIPLES",
  "DECISIONS", "BEHAVIOR", "HABITS", "MASTERY", "LEADERSHIP", "LEGACY",
] as const;
export type DevLayer = (typeof DEV_LAYERS)[number];

export const MASTERY_STAGES = [
  "NOVICE", "BEGINNER", "PRACTITIONER", "PROFESSIONAL", "EXPERT", "MASTER",
] as const;
export type MasteryStage = (typeof MASTERY_STAGES)[number];

export const SHADOW_TYPES = [
  "PROCRASTINATION", "COMFORT_ADDICTION", "STATUS_ADDICTION", "CONFIRMATION_BIAS",
  "SUNK_COST_BIAS", "EGO", "FEAR", "AVOIDANCE", "DISTRACTION",
] as const;
export type ShadowType = (typeof SHADOW_TYPES)[number];

export const SCORE_KINDS = [
  "MISSION_ALIGNMENT", "IDENTITY_ALIGNMENT", "VALUE_INTEGRITY", "MENTAL_MODEL_USAGE",
  "FIRST_PRINCIPLE", "DECISION_QUALITY", "HABIT_CONSISTENCY", "MASTERY",
  "LEADERSHIP", "LEGACY", "REFLECTION", "GROWTH",
] as const;
export type ScoreKind = (typeof SCORE_KINDS)[number];
