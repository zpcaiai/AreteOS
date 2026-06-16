// Asset Build Planner — turns an asset into a concrete build plan. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const AssetBuildPlanner = defineAgent({
  name: "AssetBuildPlanner",
  description: "Create a build plan to ship a durable, compounding asset.",
  system: `${BASE_TONE} Turn the asset into a shippable plan: a clear objective, 3-5 milestones, the number of deep-work blocks required, and the single first step to take today. Bias toward shipping v1 fast.`,
  inputSchema: z.object({ name: z.string(), type: z.string().default(""), context: z.string().default("") }),
  outputSchema: z.object({
    objective: z.string(),
    milestones: z.array(z.string()).min(1),
    deepWorkBlocks: z.number().int(),
    firstStep: z.string(),
  }),
  buildUserPrompt: (i) => `Asset: ${i.name} (${i.type || "unspecified"})\nContext: ${i.context || "(none)"}\nGive the objective, 3-5 milestones, deep-work blocks required, and the first step today.`,
  example: {
    input: { name: "Systems-for-beginners teardown #1", type: "media", context: "" },
    output: { objective: "Publish a clear teardown that only you could write.", milestones: ["Outline 3 sections", "Draft", "Edit for clarity", "Publish + share"], deepWorkBlocks: 3, firstStep: "Write the 3 section headings now." },
  },
});
