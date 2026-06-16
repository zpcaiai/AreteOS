// Mentor Council — a panel of distinct thinking lenses that DEBATE the same
// question and surface their disagreement, instead of the usual single answer.
// Each member is a normal Agent (mock-friendly), so it runs offline and is
// covered by the eval harness. NOTE: this module exports ONLY Agent instances,
// because the registry spreads `...council` into AGENTS.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";
import { COUNCIL_PERSONAS, memberInputSchema, memberOutputSchema, type CouncilPersona } from "../council-personas";

function makeCouncilMember(p: CouncilPersona) {
  return defineAgent({
    name: `Council_${p.key}`,
    description: `Mentor-council lens: ${p.name}.`,
    system: `${BASE_TONE} You are one voice on a council of mentors: ${p.name}. ${p.lens} Argue ONLY from your lens; do not hedge into the others. Take a clear position even under uncertainty.`,
    inputSchema: memberInputSchema,
    outputSchema: memberOutputSchema,
    buildUserPrompt: (i) =>
      `Question: ${i.question}\nContext: ${i.context || "(none)"}\nOptions: ${i.options.length ? i.options.join(" | ") : "(open-ended)"}\n` +
      `Give your stance (1 line), the reasoning from your lens, the single biggest risk you see, your concrete recommendation, and your confidence 0..1.`,
    example: {
      input: { question: "Should I take the manager role or stay an IC?", context: "", options: ["Accept", "Decline"] },
      output: {
        stance: p.exemplar.stance,
        reasoning: `${p.name} reasoning: ${p.lens}`,
        keyRisk: p.exemplar.risk,
        recommendation: p.exemplar.recommendation,
        confidence: 0.6,
      },
    },
    temperature: 0.5,
  });
}

export const Council_munger = makeCouncilMember(COUNCIL_PERSONAS[0]);
export const Council_drucker = makeCouncilMember(COUNCIL_PERSONAS[1]);
export const Council_naval = makeCouncilMember(COUNCIL_PERSONAS[2]);
export const Council_dalio = makeCouncilMember(COUNCIL_PERSONAS[3]);
export const Council_musk = makeCouncilMember(COUNCIL_PERSONAS[4]);

/* Moderator — synthesizes the debate, naming agreement AND the live tensions. */
export const CouncilModerator = defineAgent({
  name: "CouncilModerator",
  description: "Synthesize a mentor-council debate into consensus, tensions, and a decision.",
  system: `${BASE_TONE} You moderate a council of mentors who reason from different lenses. Do not flatten their disagreement — name where they conflict and why, then give a synthesis the user can act on. Honor the strongest dissent.`,
  inputSchema: z.object({
    question: z.string(),
    positions: z
      .array(z.object({ persona: z.string(), stance: z.string(), recommendation: z.string(), confidence: scoreField }))
      .min(1),
  }),
  outputSchema: z.object({
    agreements: z.array(z.string()).default([]),
    tensions: z.array(z.string()).default([]),
    synthesis: z.string(),
    recommendedDecision: z.string(),
    strongestDissent: z.string(),
    confidence: scoreField,
  }),
  buildUserPrompt: (i) =>
    `Question: ${i.question}\nPositions:\n${i.positions
      .map((p) => `- ${p.persona}: "${p.stance}" -> ${p.recommendation} (conf ${(p.confidence * 100).toFixed(0)}%)`)
      .join("\n")}\nName the agreements, the real tensions, a synthesis, the recommended decision, and the strongest dissenting view to keep in mind.`,
  example: {
    input: {
      question: "Should I take the manager role or stay an IC?",
      positions: [
        { persona: "The Leverage Mentor", stance: "Prefer asymmetric upside.", recommendation: "Stay IC if it compounds rarer skill.", confidence: 0.6 },
        { persona: "The Contribution Mentor", stance: "Decide by contribution.", recommendation: "Take the role if it multiplies others.", confidence: 0.6 },
      ],
    },
    output: {
      agreements: ["Both judge the role by leverage, not title or pay."],
      tensions: ["Leverage-through-rare-skill (stay IC) vs leverage-through-others (manage)."],
      synthesis: "The crux is which form of leverage compounds faster for you now.",
      recommendedDecision: "Take the role only if managing multiplies a result you already can't reach alone; otherwise deepen the rare skill first.",
      strongestDissent: "If your specific knowledge is still rare and rising, managing may cap your compounding.",
      confidence: 0.62,
    },
  },
});
