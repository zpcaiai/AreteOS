// Deep Work Review Coach — reads one session's telemetry and gives a verdict +
// the single adjustment for next time. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";

export const DeepWorkReviewCoach = defineAgent({
  name: "DeepWorkReviewCoach",
  description: "Review a deep-work session and prescribe the one adjustment for next time.",
  system: `${BASE_TONE} Deep work is output, not time-in-seat. Judge the session on protected attention and the value of what it produced. Name the focus verdict, the likely top distraction, and the single adjustment for the next block.`,
  inputSchema: z.object({
    durationMin: z.number(),
    distractions: z.number(),
    difficulty: z.number().min(0).max(1),
    outputQuality: z.number().min(0).max(1),
    notes: z.string().default(""),
  }),
  outputSchema: z.object({
    focusVerdict: z.string(),
    topDistraction: z.string(),
    oneAdjustment: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Session: ${i.durationMin}m, ${i.distractions} distractions, difficulty ${Math.round(i.difficulty * 100)}%, output ${Math.round(i.outputQuality * 100)}%.\nNotes: ${i.notes || "(none)"}\nGive the focus verdict, the likely top distraction, and the one adjustment for next time.`,
  example: {
    input: { durationMin: 90, distractions: 8, difficulty: 0.8, outputQuality: 0.5, notes: "" },
    output: { focusVerdict: "Hard task, but attention leaked — depth was shallow.", topDistraction: "Frequent context-switches (likely phone/messages).", oneAdjustment: "Phone in another room and one 50-minute block before any input next time." },
  },
});
