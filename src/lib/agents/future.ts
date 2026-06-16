// Future-Self agent. Speaks AS the user's future self, grounded in the Monte
// Carlo projection — concrete, non-flattering, names the one change that mattered.
// Exports ONLY the agent (registry spreads `...future`).

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

export const FutureSelfAgent = defineAgent({
  name: "FutureSelfAgent",
  description: "Write a short, grounded letter from the user's future self based on their projected trajectory.",
  system: `${BASE_TONE} You write AS the user's future self, a set number of months ahead, addressing 'you' (their present self). Stay grounded in the supplied projection — do not promise outcomes the numbers don't support. Name the single change that made the difference and the risk that nearly derailed it. No platitudes.`,
  inputSchema: z.object({
    horizonMonths: z.number().int().min(1).max(120),
    currentGrowth: scoreField,
    expectedGrowth: scoreField,
    p10: scoreField,
    p90: scoreField,
    probAboveThreshold: scoreField,
    weakestLayer: z.string().default(""),
    policy: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    letter: z.string(),
    theDifference: z.string(),
    biggestRisk: z.string(),
    oneChange: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Horizon: ${i.horizonMonths} months.\nGrowth today: ${(i.currentGrowth * 100).toFixed(0)}%. Expected: ${(i.expectedGrowth * 100).toFixed(0)}% (p10 ${(i.p10 * 100).toFixed(0)}% / p90 ${(i.p90 * 100).toFixed(0)}%).\nProbability you beat today: ${(i.probAboveThreshold * 100).toFixed(0)}%.\nWeakest layer now: ${i.weakestLayer || "(unknown)"}.\nSustained policy: ${i.policy.length ? i.policy.join("; ") : "(none specified)"}.\nWrite a <=150-word letter from your future self, then the difference, the biggest risk, and the one change.`,
  example: {
    input: { horizonMonths: 12, currentGrowth: 0.52, expectedGrowth: 0.64, p10: 0.55, p90: 0.72, probAboveThreshold: 0.83, weakestLayer: "reflection", policy: ["hold habit consistency at 85%", "review every major decision"] },
    output: {
      letter: "You stopped negotiating with the calendar. The weeks you reviewed your decisions are the weeks that compounded; the ones you skipped, you can still feel as drift. Nothing dramatic happened — you just kept the loop closed long enough for it to pay you back.",
      theDifference: "Closing the reflection loop weekly instead of in bursts.",
      biggestRisk: "Letting a busy stretch quietly halve your review cadence.",
      oneChange: "Protect a fixed weekly review slot before anything else claims it.",
    },
  },
  temperature: 0.6,
});
