// Management OS — maturity model & leverage tiers. Client-safe (no Prisma).
export type MLevel = "SUPERVISOR" | "MANAGER" | "DIRECTOR" | "LEADER" | "VISIONARY" | "SYSTEM_ARCHITECT" | "ORG_DESIGNER";

export interface MLevelInfo { level: MLevel; n: number; focus: string; question: string }

export const MATURITY: MLevelInfo[] = [
  { level: "SUPERVISOR", n: 1, focus: "Behavior", question: "Did they do it?" },
  { level: "MANAGER", n: 2, focus: "Process", question: "Was the process followed?" },
  { level: "DIRECTOR", n: 3, focus: "Capability", question: "Can people perform?" },
  { level: "LEADER", n: 4, focus: "Identity", question: "Who are we becoming?" },
  { level: "VISIONARY", n: 5, focus: "Mission", question: "Why do we exist?" },
  { level: "SYSTEM_ARCHITECT", n: 6, focus: "Systems", question: "How do we scale success?" },
  { level: "ORG_DESIGNER", n: 7, focus: "Culture", question: "How do we replicate excellence?" },
];

export const LEVERAGE_EXAMPLES: Record<"LOW" | "MEDIUM" | "HIGH", string[]> = {
  LOW: ["Status meetings", "Approvals", "Report checking"],
  MEDIUM: ["Training", "Documentation", "Hiring"],
  HIGH: ["Leader development", "Architecture decisions", "Knowledge systems", "Operating principles"],
};

export const FIRST_PRINCIPLES = [
  "Management is system design, not people control.",
  "Knowledge workers must be aligned, not supervised.",
  "Mission alignment creates more leverage than behavior control.",
  "Knowledge must become organizational assets.",
  "High-leverage activities matter more than activity volume.",
  "Organizations must become anti-fragile.",
];
