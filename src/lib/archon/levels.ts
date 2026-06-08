// Leadership Leverage — logical levels & roles catalog. Client-safe (no Prisma).
// Higher level = higher leverage. Each level maps to a leadership role.

export type Level = "ENVIRONMENT" | "BEHAVIOR" | "CAPABILITY" | "BELIEF" | "IDENTITY" | "MISSION";
export type Role = "CARETAKER" | "GUIDE" | "COACH" | "MENTOR" | "SPONSOR" | "AWAKENER";

export interface LevelInfo {
  level: Level; n: number; question: string; role: Role; leverage: string;
  responsibilities: string[]; output: string;
}

export const LEVELS: LevelInfo[] = [
  { level: "ENVIRONMENT", n: 1, question: "Where / when / with what resources?", role: "CARETAKER", leverage: "Low",
    responsibilities: ["Create safe environments", "Remove obstacles", "Provide resources"], output: "Environment Health Score" },
  { level: "BEHAVIOR", n: 2, question: "What are people doing?", role: "GUIDE", leverage: "Low–Medium",
    responsibilities: ["Clarify expectations", "Create accountability", "Provide feedback"], output: "Behavior Consistency Score" },
  { level: "CAPABILITY", n: 3, question: "How do people perform?", role: "COACH", leverage: "Medium",
    responsibilities: ["Develop skills", "Develop competence", "Provide training"], output: "Capability Growth Score" },
  { level: "BELIEF", n: 4, question: "Why do people act?", role: "MENTOR", leverage: "High",
    responsibilities: ["Shape beliefs", "Clarify values", "Challenge assumptions"], output: "Belief Alignment Score" },
  { level: "IDENTITY", n: 5, question: "Who are we becoming?", role: "SPONSOR", leverage: "Very High",
    responsibilities: ["Recognize potential", "Strengthen identity", "Create belonging"], output: "Identity Alignment Score" },
  { level: "MISSION", n: 6, question: "For what larger purpose?", role: "AWAKENER", leverage: "Maximum",
    responsibilities: ["Inspire meaning", "Connect people to mission", "Create shared future"], output: "Mission Alignment Score" },
];

export interface RoleInfo {
  role: Role; level: Level; mindset: string; responsibilities: string;
  typicalQuestion: string; successMetric: string; failureMode: string;
}

export const ROLES: RoleInfo[] = [
  { role: "CARETAKER", level: "ENVIRONMENT", mindset: "Make it safe and possible.", responsibilities: "Resources, safety, obstacle removal.",
    typicalQuestion: "What's getting in your way?", successMetric: "Environment health", failureMode: "Over-protecting; no growth pressure." },
  { role: "GUIDE", level: "BEHAVIOR", mindset: "Make expectations clear.", responsibilities: "Expectations, accountability, feedback.",
    typicalQuestion: "What exactly needs to happen?", successMetric: "Behavior consistency", failureMode: "Micromanaging behavior." },
  { role: "COACH", level: "CAPABILITY", mindset: "Develop the ability.", responsibilities: "Skill and competence development.",
    typicalQuestion: "How could you do this better?", successMetric: "Capability growth", failureMode: "Coaching skills while ignoring beliefs." },
  { role: "MENTOR", level: "BELIEF", mindset: "Shape why they act.", responsibilities: "Beliefs, values, assumptions.",
    typicalQuestion: "What do you believe is true here?", successMetric: "Belief alignment", failureMode: "Imposing beliefs instead of surfacing them." },
  { role: "SPONSOR", level: "IDENTITY", mindset: "See and strengthen who they are.", responsibilities: "Recognition, identity, belonging.",
    typicalQuestion: "Who are you becoming?", successMetric: "Identity alignment", failureMode: "Praising work, never the person's identity." },
  { role: "AWAKENER", level: "MISSION", mindset: "Connect to larger purpose.", responsibilities: "Meaning, mission, shared future.",
    typicalQuestion: "What larger purpose does this serve?", successMetric: "Mission alignment", failureMode: "Inspiration without grounding." },
];

export const ROLE_RANK: Record<Role, number> = {
  CARETAKER: 1, GUIDE: 2, COACH: 3, MENTOR: 4, SPONSOR: 5, AWAKENER: 6,
};
