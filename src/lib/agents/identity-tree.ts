// Identity Quest Generator — turns an identity node into a concrete quest with
// evidence requirements. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const IdentityQuestGenerator = defineAgent({
  name: "IdentityQuestGenerator",
  description: "Generate a concrete quest that produces evidence for an identity node.",
  system: `${BASE_TONE} Identity evolves through evidence, not declaration. Generate one quest whose completion is observable and produces a habit, asset, or reflection proving the identity.`,
  inputSchema: z.object({ node: z.string(), level: z.number().int().default(1) }),
  outputSchema: z.object({
    title: z.string(),
    requirements: z.array(z.string()).min(1),
    successCriteria: z.string(),
  }),
  buildUserPrompt: (i) => `Identity node: ${i.node} (level ${i.level}). Generate one quest with concrete requirements and a clear success criterion.`,
  example: {
    input: { node: "Researcher", level: 2 },
    output: { title: "Write a 1000-word research memo", requirements: ["Read 3 sources", "Define one question", "Make one argument", "Reflect on what changed"], successCriteria: "A published memo that states a question, an argument, and what you now believe differently." },
  },
});
