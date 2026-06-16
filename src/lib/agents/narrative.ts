// Growth Narrator — turns extracted narrative signals into the "story of who you
// are becoming". Exports ONLY the agent (registry spreads `...narrative`).

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const GrowthNarrator = defineAgent({
  name: "GrowthNarrator",
  description: "Render structured growth signals into a short, true, non-flattering narrative of the user's development.",
  system: `${BASE_TONE} You write the story of who the user is becoming, strictly from the supplied signals (trajectory, turning points, activity, stage transitions). Make meaning, do not invent events the data doesn't show. Honest about regressions. No horoscope vagueness.`,
  inputSchema: z.object({
    periodLabel: z.string().default("recent"),
    momentum: z.string(),
    changePct: z.number(),
    topEngine: z.string().default(""),
    turningPoints: z.array(z.string()).default([]),
    transitions: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    title: z.string(),
    chapters: z.array(z.object({ heading: z.string(), body: z.string() })).min(1),
    throughline: z.string(),
    nextChapter: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Period: ${i.periodLabel}. Momentum: ${i.momentum}. Net growth change: ${i.changePct >= 0 ? "+" : ""}${i.changePct.toFixed(1)} pts.\n` +
    `Most active engine: ${i.topEngine || "(n/a)"}.\nTurning points: ${i.turningPoints.length ? i.turningPoints.join("; ") : "(none)"}.\n` +
    `Stage transitions: ${i.transitions.length ? i.transitions.join("; ") : "(none)"}.\n` +
    `Write a title, 2-4 short chapters tied to these signals, a throughline, and the likely next chapter.`,
  example: {
    input: { periodLabel: "the last 90 days", momentum: "rising", changePct: 7.4, topEngine: "Decision", turningPoints: ["+9 pts after you began reviewing decisions"], transitions: ["BUILDER → OPERATOR"] },
    output: {
      title: "The Quarter You Started Closing Loops",
      chapters: [
        { heading: "From motion to method", body: "Your growth was flat until you began reviewing decisions; that is the moment the line bends upward." },
        { heading: "Becoming an Operator", body: "Crossing into the Operator stage shows up as steadier follow-through, not louder ambition." },
      ],
      throughline: "You compound when you close the loop, not when you start more things.",
      nextChapter: "Protect the review cadence under load — that is where the next stage is won or lost.",
    },
  },
  temperature: 0.6,
});
