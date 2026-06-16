// Evidence Interpreter — explains the identity-behavior gap and proposes the
// cheapest behavioral test to close it. Exports ONLY the agent.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";

export const EvidenceInterpreter = defineAgent({
  name: "EvidenceInterpreter",
  description: "Interpret the gap between stated scores and enacted behavioral evidence.",
  system: `${BASE_TONE} You compare what the user CLAIMS (stated scores) with what their BEHAVIOR shows (enacted evidence). Name the biggest overclaim plainly but without moralizing, and propose one cheap, observable behavior change that would close it. Evidence over opinion.`,
  inputSchema: z.object({
    overallIntegrity: scoreField,
    gaps: z.array(z.object({ domain: z.string(), stated: scoreField, enacted: scoreField, gap: z.number(), samples: z.number() })).default([]),
  }),
  outputSchema: z.object({
    summary: z.string(),
    biggestGap: z.string(),
    suggestedExperiment: z.string(),
  }),
  buildUserPrompt: (i) =>
    `Overall integrity (words vs behavior): ${(i.overallIntegrity * 100).toFixed(0)}%.\nDomains:\n${i.gaps
      .map((g) => `- ${g.domain}: stated ${(g.stated * 100).toFixed(0)}% vs enacted ${(g.enacted * 100).toFixed(0)}% (gap ${(g.gap * 100).toFixed(0)}, n=${g.samples})`)
      .join("\n")}\nSummarize honestly, name the biggest overclaim, and propose one cheap behavioral test to close it.`,
  example: {
    input: { overallIntegrity: 0.74, gaps: [{ domain: "reflection", stated: 0.8, enacted: 0.4, gap: 0.4, samples: 12 }] },
    output: {
      summary: "Your words and behavior mostly agree, except on reflection.",
      biggestGap: "You rate reflection highly (80%) but your journal shows ~40% adherence.",
      suggestedExperiment: "For two weeks, log a 3-line review each night; we will re-measure enacted reflection against your claim.",
    },
  },
});
