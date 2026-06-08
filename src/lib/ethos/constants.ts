// Identity Library — client-safe constants (no Prisma).
export type StackRole = "PRIMARY" | "SECONDARY" | "EMERGING" | "LEGACY";
export type Stage = "DISCOVER" | "CHOOSE" | "PRACTICE" | "INTERNALIZE" | "INTEGRATE" | "MASTER" | "TEACH" | "LEGACY";

export const STACK_ROLES: { role: StackRole; label: string; hint: string }[] = [
  { role: "PRIMARY", label: "Primary", hint: "The identity that organizes most decisions now." },
  { role: "SECONDARY", label: "Secondary", hint: "A strong supporting identity you also operate from." },
  { role: "EMERGING", label: "Emerging", hint: "The identity you're growing into next." },
  { role: "LEGACY", label: "Legacy", hint: "The identity you want to leave behind in others." },
];

export const STAGES: Stage[] = ["DISCOVER", "CHOOSE", "PRACTICE", "INTERNALIZE", "INTEGRATE", "MASTER", "TEACH", "LEGACY"];
export const STAGE_INDEX: Record<Stage, number> = Object.fromEntries(STAGES.map((s, i) => [s, i])) as Record<Stage, number>;

export const FAMILIES: { slug: string; name: string; purpose: string }[] = [
  { slug: "truth-seekers", name: "Truth Seekers", purpose: "Understand reality" },
  { slug: "creators", name: "Creators", purpose: "Create new realities" },
  { slug: "builders", name: "Builders", purpose: "Transform ideas into systems" },
  { slug: "entrepreneurs", name: "Entrepreneurs", purpose: "Create value" },
  { slug: "investors", name: "Investors", purpose: "Allocate resources wisely" },
  { slug: "leaders", name: "Leaders", purpose: "Develop and influence people" },
  { slug: "teachers", name: "Teachers", purpose: "Develop others" },
  { slug: "protectors", name: "Protectors", purpose: "Preserve what matters" },
  { slug: "transformers", name: "Transformers", purpose: "Create meaningful change" },
  { slug: "legacy-builders", name: "Legacy Builders", purpose: "Create impact beyond self" },
];
