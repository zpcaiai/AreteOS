// Bottleneck Diagnostician — refines the rule-based preliminary diagnosis into a
// primary/secondary call with a root cause and the next engine to use. Exports
// ONLY the agent (registry spreads `...bottleneck`).

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

export const BottleneckDiagnostician = defineAgent({
  name: "BottleneckDiagnostician",
  description: "Diagnose the true growth bottleneck from signals + a rule-based preliminary ranking.",
  system: `${BASE_TONE} Growth is limited by the strongest constraint. Do not recommend more action until the real bottleneck is named. Use the preliminary ranking as a prior, but correct it from the problem statement. Name the single most likely bottleneck, the root cause, and the one engine to use next.`,
  inputSchema: z.object({
    problemStatement: z.string().default(""),
    signals: z.array(z.string()).default([]),
    prelim: z.array(z.object({ key: z.string(), name: z.string(), score: z.number() })).default([]),
  }),
  outputSchema: z.object({
    primaryBottleneck: z.string(),
    secondaryBottlenecks: z.array(z.string()).default([]),
    rootCause: z.string(),
    confidence: scoreField,
    recommendedNextEngine: z.string(),
    recommendation: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Problem: ${i.problemStatement || "(none)"}\nActive signals: ${i.signals.join(", ") || "(none)"}\nPreliminary ranking: ${i.prelim.map((p) => `${p.key}(${p.score})`).join(", ") || "(none)"}\nName the primary bottleneck, up to 3 secondary, the root cause, confidence 0..1, the recommended next engine, and one concrete recommendation.`,
  example: {
    input: { problemStatement: "I read constantly but never publish anything.", signals: ["consumesNoOutput", "avoidsImportantWork"], prelim: [{ key: "asset", name: "Asset", score: 2 }, { key: "shadow", name: "Shadow", score: 2 }] },
    output: {
      primaryBottleneck: "asset",
      secondaryBottlenecks: ["shadow", "focus"],
      rootCause: "Consumption feels productive and safe; shipping risks judgment, so output never happens.",
      confidence: 0.72,
      recommendedNextEngine: "Asset-Based Growth Engine",
      recommendation: "Commit to publishing one small, imperfect asset within 7 days before consuming anything new.",
    },
  },
});
