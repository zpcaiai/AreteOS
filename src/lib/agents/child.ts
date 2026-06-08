import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

/* ───────────────────────── Child Development OS — Genius Kids ───────────────────────── */
const KID_TONE = BASE_TONE + " You develop children (6-18) as curious, capable, creative, resilient lifelong learners. Inspired by widely-taught ideas: growth mindset, Montessori prepared environments, Reggio-Emilia curiosity, and the three-role creative method. Never optimize for grades, obedience or test scores — optimize for curiosity, agency, creativity, resilience, identity and lifelong learning. Warm, concrete, age-appropriate. Adults design environments and sponsor identity; they do not control.";

const KID_IDENTITY = z.enum(["EXPLORER","RESEARCHER","CREATOR","BUILDER","INVENTOR","PROBLEM_SOLVER","COLLABORATOR","STORYTELLER","LEADER","MENTOR"]);

/* KID-1 ─ IdentitySponsorAgent */
export const IdentitySponsorAgent = defineAgent({
  name: "IdentitySponsorAgent",
  description: "Help a child build healthy creator identities (explorer, builder, etc.) through sponsorship.",
  system: `${KID_TONE} From what the child does and loves, name the identities they already show (with evidence), strengths, growth opportunities, and identity-level sponsorship language ('you are someone who…').`,
  inputSchema: z.object({ observations: z.array(z.string()).default([]), age: z.number().optional() }),
  outputSchema: z.object({
    primaryIdentity: KID_IDENTITY, emergingIdentity: KID_IDENTITY,
    strengths: z.array(z.string()), opportunities: z.array(z.string()), sponsorship: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Age: ${i.age ?? "?"}\nObservations:\n${i.observations.join("\n")}\nName primary + emerging identity, strengths, opportunities, and sponsorship phrases.`,
  example: {
    input: { observations: ["Takes toys apart to see how they work"], age: 8 },
    output: { primaryIdentity: "EXPLORER", emergingIdentity: "BUILDER", strengths: ["Curiosity", "Hands-on"],
      opportunities: ["Turn taking-apart into building"], sponsorship: ["You are someone who loves to find out how things work."] },
  },
});

/* KID-2 ─ GrowthMindsetCoach */
export const GrowthMindsetCoach = defineAgent({
  name: "GrowthMindsetCoach",
  description: "Detect fixed-mindset statements and reframe them into growth beliefs.",
  system: `${KID_TONE} Detect fixed-mindset statements ('I'm not smart', 'I can't do math') and reframe each into a true, specific growth statement. Score current growth-mindset 0..1 and give a short plan.`,
  inputSchema: z.object({ statements: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    reframes: z.array(z.object({ fixed: z.string(), growth: z.string() })),
    growthMindsetScore: scoreField, plan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Child statements:\n${i.statements.join("\n")}\nReframe fixed → growth, score, and plan.`,
  example: {
    input: { statements: ["I can't do math"] },
    output: { reframes: [{ fixed: "I can't do math", growth: "I can't do this kind of math YET — with practice it gets easier." }], growthMindsetScore: 0.4, plan: ["Praise effort and strategy, not 'being smart'", "Add 'yet' to 'I can't' statements"] },
  },
});

/* KID-3 ─ ExplorerCoach */
export const ExplorerCoach = defineAgent({
  name: "ExplorerCoach",
  description: "Grow curiosity: turn interests into questions, experiments and explorations.",
  system: `${KID_TONE} Turn a child's interest into good questions, cheap experiments, and topics to explore. Score curiosity 0..1.`,
  inputSchema: z.object({ interest: z.string(), age: z.number().optional() }),
  outputSchema: z.object({ questions: z.array(z.string()), experiments: z.array(z.string()), topics: z.array(z.string()), curiosityScore: scoreField }),
  buildUserPrompt: (i) => `Interest: ${i.interest}\nAge: ${i.age ?? "?"}\nGenerate questions, cheap experiments, topics, and a curiosity score.`,
  example: {
    input: { interest: "dinosaurs", age: 7 },
    output: { questions: ["Why did some dinosaurs have feathers?"], experiments: ["Make a fossil imprint in clay"], topics: ["Birds as living dinosaurs"], curiosityScore: 0.7 },
  },
});

/* KID-4 ─ CreativityCoach */
export const CreativityCoach = defineAgent({
  name: "CreativityCoach",
  description: "Protect and grow creativity through dreamer/builder/critic modes.",
  system: `${KID_TONE} Guide a creative project through three separated roles — dreamer (imagine), builder (make), critic (improve the plan, never the child). Output prompts for each mode and a creative-confidence score.`,
  inputSchema: z.object({ idea: z.string(), age: z.number().optional() }),
  outputSchema: z.object({
    dreamer: z.array(z.string()), builder: z.array(z.string()), critic: z.array(z.string()), confidence: scoreField,
  }),
  buildUserPrompt: (i) => `Project idea: ${i.idea}\nAge: ${i.age ?? "?"}\nGive dreamer, builder and critic prompts and a confidence score.`,
  example: {
    input: { idea: "make a comic about a space cat", age: 9 },
    output: { dreamer: ["What's the cat's superpower?"], builder: ["Fold paper into 6 panels and sketch"], critic: ["Which panel is hardest to follow? (fix the panel, not yourself)"], confidence: 0.7 },
  },
});

/* KID-5 ─ MontessoriEnvironmentAdvisor */
export const MontessoriEnvironmentAdvisor = defineAgent({
  name: "MontessoriEnvironmentAdvisor",
  description: "Help parents design a high-leverage prepared environment.",
  system: `${KID_TONE} Assess the learning environment (noise, distraction, autonomy, exploration opportunities, physical accessibility) 0..1 and give a concrete upgrade plan.`,
  inputSchema: z.object({ description: z.string() }),
  outputSchema: z.object({
    scores: z.object({ noise: scoreField, distraction: scoreField, autonomy: scoreField, exploration: scoreField, accessibility: scoreField }),
    upgradePlan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Environment:\n${i.description}\nScore each factor (noise/distraction are 'how much', autonomy/exploration/accessibility are 'how good') and give an upgrade plan.`,
  example: {
    input: { description: "TV always on; toys out of reach; little choice" },
    output: { scores: { noise: 0.8, distraction: 0.8, autonomy: 0.3, exploration: 0.4, accessibility: 0.3 },
      upgradePlan: ["Create a quiet, screen-free work corner", "Put materials at child height for free choice"] },
  },
});

/* KID-6 ─ LearningAutonomyCoach */
export const LearningAutonomyCoach = defineAgent({
  name: "LearningAutonomyCoach",
  description: "Develop self-directed learning: initiative, ownership, persistence, focus.",
  system: `${KID_TONE} Score learning autonomy dimensions (initiative, ownership, persistence, focus, independent learning) 0..1 and give a growth plan that shifts control to the child.`,
  inputSchema: z.object({ observations: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ initiative: scoreField, ownership: scoreField, persistence: scoreField, focus: scoreField, independentLearning: scoreField }),
    plan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Observations:\n${i.observations.join("\n")}\nScore autonomy and give a plan.`,
  example: {
    input: { observations: ["Waits to be told what to do"] },
    output: { scores: { initiative: 0.3, ownership: 0.4, persistence: 0.5, focus: 0.5, independentLearning: 0.4 },
      plan: ["Offer choices, not instructions", "Let the child plan one activity per day"] },
  },
});

/* KID-7 ─ ProblemSolvingCoach */
export const ProblemSolvingCoach = defineAgent({
  name: "ProblemSolvingCoach",
  description: "Develop first-principles problem solving: observe, question, hypothesize, experiment, reflect.",
  system: `${KID_TONE} Walk a child through observe → question → hypothesize → experiment → reflect for a real problem. Age-appropriate. Score problem-solving 0..1.`,
  inputSchema: z.object({ problem: z.string(), age: z.number().optional() }),
  outputSchema: z.object({
    observe: z.string(), question: z.string(), hypothesis: z.string(), experiment: z.string(), reflect: z.string(), score: scoreField,
  }),
  buildUserPrompt: (i) => `Problem: ${i.problem}\nAge: ${i.age ?? "?"}\nGuide the five steps and score.`,
  example: {
    input: { problem: "My plant keeps dying", age: 10 },
    output: { observe: "When do the leaves droop?", question: "Is it water or light?", hypothesis: "Maybe too little light.",
      experiment: "Move it to a sunny window for a week and watch.", reflect: "What changed? What will you try next?", score: 0.7 },
  },
});

/* KID-8 ─ ProjectMentor */
export const ProjectMentor = defineAgent({
  name: "ProjectMentor",
  description: "Turn a child's interest into a project with milestones and capabilities built.",
  system: `${KID_TONE} Turn an interest into a hands-on project: a clear goal, 3-5 milestones, and the capabilities it builds. Keep it joyful, not graded.`,
  inputSchema: z.object({ interest: z.string(), age: z.number().optional() }),
  outputSchema: z.object({ title: z.string(), goal: z.string(), milestones: z.array(z.string()), capabilities: z.array(z.string()) }),
  buildUserPrompt: (i) => `Interest: ${i.interest}\nAge: ${i.age ?? "?"}\nDesign a project: title, goal, milestones, capabilities.`,
  example: {
    input: { interest: "robots", age: 11 },
    output: { title: "Build a paper-cup robot", goal: "Make a robot that can hold a pencil", milestones: ["Design it", "Build the body", "Add arms", "Show someone"], capabilities: ["Planning", "Building", "Iteration"] },
  },
});

/* KID-9 ─ ResilienceCoach */
export const ResilienceCoach = defineAgent({
  name: "ResilienceCoach",
  description: "Build anti-fragility: failure recovery, persistence, healthy risk, emotional regulation.",
  system: `${KID_TONE} Score resilience dimensions (failure recovery, persistence, risk taking, emotional regulation) 0..1 and give a gentle growth plan that reframes failure as data.`,
  inputSchema: z.object({ situation: z.string(), observations: z.array(z.string()).default([]) }),
  outputSchema: z.object({
    scores: z.object({ failureRecovery: scoreField, persistence: scoreField, riskTaking: scoreField, emotionalRegulation: scoreField }),
    plan: z.array(z.string()),
  }),
  buildUserPrompt: (i) => `Situation: ${i.situation}\nObservations: ${i.observations.join("; ")}\nScore resilience and give a plan.`,
  example: {
    input: { situation: "Gives up when something is hard" },
    output: { scores: { failureRecovery: 0.3, persistence: 0.3, riskTaking: 0.4, emotionalRegulation: 0.4 },
      plan: ["Name the feeling, then try one more time", "Celebrate the attempt, not just success", "Share your own failures out loud"] },
  },
});

/* KID-10 ─ ParentCoach */
export const ParentCoach = defineAgent({
  name: "ParentCoach",
  description: "Teach parents high-leverage interventions and give conversation scripts.",
  system: `${KID_TONE} Coach the parent as environment designer, identity sponsor, curiosity coach, growth-mindset coach and project mentor. Give weekly guidance, conversation scripts, and a support score 0..1.`,
  inputSchema: z.object({ context: z.array(z.string()).default([]), role: z.string().optional() }),
  outputSchema: z.object({
    role: z.string(), guidance: z.array(z.string()), conversationScripts: z.array(z.string()), supportScore: scoreField,
  }),
  buildUserPrompt: (i) => `Role: ${i.role ?? "(infer)"}\nContext:\n${i.context.join("\n")}\nGive weekly guidance, conversation scripts, and a support score.`,
  example: {
    input: { context: ["I keep correcting my kid's drawing"], role: "Identity Sponsor" },
    output: { role: "Identity Sponsor", guidance: ["Sponsor the identity, don't fix the output"],
      conversationScripts: ["'Tell me about your drawing — what's happening here?' instead of 'the sky isn't purple'"], supportScore: 0.5 },
  },
});
