// Prescription Generator — personalizes a bottleneck template into a concrete,
// time-bounded intervention for the user's context. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const PrescriptionGenerator = defineAgent({
  name: "PrescriptionGenerator",
  description: "Turn a bottleneck + template into a personalized 7-day / 30-day growth prescription.",
  system: `${BASE_TONE} A prescription is targeted, time-bounded, measurable, and identity-aligned — never generic advice. Personalize the template to the user's context. Keep the 7-day plan tiny and unmissable.`,
  inputSchema: z.object({
    bottleneck: z.string(),
    context: z.string().default(""),
    objective: z.string().default(""),
    sevenDay: z.array(z.string()).default([]),
    thirtyDay: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    title: z.string(),
    whyItMatters: z.string(),
    sevenDay: z.array(z.string()).min(1),
    thirtyDay: z.array(z.string()).min(1),
    metrics: z.array(z.string()).default([]),
    firstAction: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Bottleneck: ${i.bottleneck}\nContext: ${i.context || "(none)"}\nObjective: ${i.objective}\nTemplate 7-day: ${i.sevenDay.join("; ")}\nTemplate 30-day: ${i.thirtyDay.join("; ")}\nPersonalize into a titled prescription with whyItMatters, a 7-day plan, a 30-day plan, metrics, and the single first action to take today.`,
  example: {
    input: { bottleneck: "asset", context: "I read constantly but never publish.", objective: "Turn consumption into durable output.", sevenDay: ["Outline one asset", "Block one deep-work session"], thirtyDay: ["Publish v1", "Revise into a reusable asset"] },
    output: {
      title: "30-Day Knowledge Asset Creation",
      whyItMatters: "Consumption feels productive but compounds nothing; one shipped asset changes your trajectory.",
      sevenDay: ["Pick one topic you already understand and outline a 600-word piece", "Book a 60-minute deep-work block and draft it"],
      thirtyDay: ["Publish version one and ask 3 people for feedback", "Revise it into a reusable template or thread"],
      metrics: ["deep-work sessions completed", "asset published (yes/no)", "feedback responses"],
      firstAction: "Write the outline's 3 section headings before you read anything else today.",
    },
  },
});
