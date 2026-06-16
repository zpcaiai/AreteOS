// Personal OS Synthesizer — compiles a desired identity (+ chosen template) into a
// complete, executable personal operating system. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

const stack = z.object({ primary: z.string(), secondary: z.string(), emerging: z.string(), legacy: z.string() });
const ninety = z.object({ m1: z.string(), m2: z.string(), m3: z.string() });

export const PersonalOSSynthesizer = defineAgent({
  name: "PersonalOSSynthesizer",
  description: "Compile a desired identity into an executable personal operating system.",
  system: `${BASE_TONE} You are a life-OS compiler. Given the user's desired identity and a starting template, produce a coherent, executable system: mission, identity stack, values, skill tree, identity-based habits, a deep-work rhythm, an asset roadmap, decision rules, a risk map, and a concrete 90-day plan. Personalize the template; keep everything specific and shippable.`,
  inputSchema: z.object({
    intent: z.string(),
    templateName: z.string().default(""),
    identityStack: stack.partial().default({}),
    values: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    habits: z.array(z.string()).default([]),
    decisionRules: z.array(z.string()).default([]),
    ninetyDay: ninety.partial().default({}),
  }),
  outputSchema: z.object({
    mission: z.string(),
    identityStack: stack,
    values: z.array(z.string()).min(1),
    skillTree: z.array(z.string()).min(1),
    habits: z.array(z.string()).min(1),
    deepWork: z.string(),
    assetRoadmap: z.array(z.string()).min(1),
    decisionRules: z.array(z.string()).min(1),
    riskMap: z.array(z.string()).default([]),
    ninetyDayPlan: ninety,
  }),
  buildUserPrompt: (i) =>
    `Desired identity: ${i.intent}\nTemplate: ${i.templateName}\nTemplate identity stack: ${JSON.stringify(i.identityStack)}\nTemplate values: ${i.values.join(", ")}\nTemplate skills: ${i.skills.join(", ")}\nTemplate habits: ${i.habits.join(", ")}\nCompile the full personal OS (mission, identity stack, values, skill tree, habits, deep-work rhythm, asset roadmap, decision rules, risk map, 90-day plan).`,
  example: {
    input: { intent: "I want to become an AI research entrepreneur.", templateName: "AI Entrepreneur OS", identityStack: { primary: "Researcher", secondary: "Builder", emerging: "Entrepreneur", legacy: "Mentor" }, values: ["Truth", "Leverage"], skills: ["AI research"], habits: ["Read one paper daily"], decisionRules: ["Evidence before enthusiasm"], ninetyDay: { m1: "Research" } },
    output: {
      mission: "Build AI systems that transform human learning and development.",
      identityStack: { primary: "Researcher", secondary: "Builder", emerging: "Entrepreneur", legacy: "Mentor" },
      values: ["Truth", "Leverage", "Usefulness", "Long-termism", "Integrity"],
      skillTree: ["AI research", "software architecture", "product discovery", "writing", "distribution", "business-model design"],
      habits: ["Read one paper daily", "Write one research note daily", "Build one prototype weekly", "Talk to one user weekly"],
      deepWork: "4 deep-work blocks per week, mornings, single-tasked.",
      assetRoadmap: ["Research memo", "Prototype", "Public essay", "MVP", "User-interview database"],
      decisionRules: ["Evidence before enthusiasm", "Prototype before scaling", "Users before abstraction", "Compounding over attention"],
      riskMap: ["Single-income fragility — keep a runway buffer", "Over-research without shipping — enforce a publish cadence"],
      ninetyDayPlan: { m1: "Research + problem discovery", m2: "Prototype + publish", m3: "User feedback + MVP iteration" },
    },
  },
});
