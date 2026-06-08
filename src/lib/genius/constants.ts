// Child Development OS — client-safe catalog. Six high-leverage capabilities matter
// more than grades: curiosity, creativity, agency, resilience, problem-solving, lifelong learning.
export type ChildIdentity =
  | "EXPLORER" | "RESEARCHER" | "CREATOR" | "BUILDER" | "INVENTOR"
  | "PROBLEM_SOLVER" | "COLLABORATOR" | "STORYTELLER" | "LEADER" | "MENTOR";

export const CHILD_IDENTITIES: { kind: ChildIdentity; label: string; sponsorPhrase: string }[] = [
  { kind: "EXPLORER", label: "Explorer", sponsorPhrase: "You are someone who loves to find out." },
  { kind: "RESEARCHER", label: "Researcher", sponsorPhrase: "You are someone who asks good questions and checks." },
  { kind: "CREATOR", label: "Creator", sponsorPhrase: "You are someone who makes new things." },
  { kind: "BUILDER", label: "Builder", sponsorPhrase: "You are someone who turns ideas into real things." },
  { kind: "INVENTOR", label: "Inventor", sponsorPhrase: "You are someone who solves problems in new ways." },
  { kind: "PROBLEM_SOLVER", label: "Problem Solver", sponsorPhrase: "You are someone who figures things out." },
  { kind: "COLLABORATOR", label: "Collaborator", sponsorPhrase: "You are someone who makes a team better." },
  { kind: "STORYTELLER", label: "Storyteller", sponsorPhrase: "You are someone who brings ideas to life with stories." },
  { kind: "LEADER", label: "Leader", sponsorPhrase: "You are someone who helps others move forward." },
  { kind: "MENTOR", label: "Mentor", sponsorPhrase: "You are someone who helps others grow." },
];

export const SIX_CAPABILITIES = ["Curiosity", "Creativity", "Agency", "Resilience", "Problem Solving", "Lifelong Learning"];

// Parent operates at high-leverage roles, not control.
export const PARENT_ROLES = ["Environment Designer", "Identity Sponsor", "Curiosity Coach", "Growth Mindset Coach", "Project Mentor"];
