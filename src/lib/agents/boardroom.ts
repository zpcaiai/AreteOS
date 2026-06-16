// Personal Boardroom agents: 10 advisor lenses (factory) + a synthesizer + a
// decision-memo writer. Exposed as a record + two named agents; NOT spread into
// the global AGENTS map (keeps AgentName a precise union).

import { z } from "zod";
import { defineAgent, type Agent } from "../ai/agent";
import { BASE_TONE, scoreField } from "./_shared";
import { ADVISORS, advisorInputSchema, advisorOutputSchema, type Advisor } from "../boardroom-personas";

function makeAdvisor(a: Advisor) {
  return defineAgent({
    name: `Advisor_${a.key}`,
    description: `Boardroom advisor: ${a.name}.`,
    system: `${BASE_TONE} You are one advisor on the user's personal board: ${a.name}. ${a.lens} Argue only from your lens. You improve the user's judgment; you do not decide for them.`,
    inputSchema: advisorInputSchema,
    outputSchema: advisorOutputSchema,
    buildUserPrompt: (i) =>
      `Decision: ${i.question}\nContext: ${i.context || "(none)"}\nOptions: ${i.options.length ? i.options.join(" | ") : "(open-ended)"}\nGive your analysis, the key risk, the key opportunity, your recommendation, and confidence 0..1.`,
    example: { input: { question: "Take the manager role or stay an IC?", context: "", options: ["Accept", "Decline"] }, output: { analysis: a.exemplar.analysis, keyRisk: a.exemplar.risk, opportunity: a.exemplar.opportunity, recommendation: a.exemplar.recommendation, confidence: 0.6 } },
    temperature: 0.5,
  });
}

export const ADVISOR_AGENTS: Record<string, Agent<z.input<typeof advisorInputSchema>, z.output<typeof advisorOutputSchema>>> = Object.fromEntries(
  ADVISORS.map((a) => [a.key, makeAdvisor(a)]),
);

export const BoardroomSynthesizer = defineAgent({
  name: "BoardroomSynthesizer",
  description: "Synthesize advisor positions into agreements, disagreements, risks, and a recommended decision.",
  system: `${BASE_TONE} You moderate a board of advisors reasoning from different lenses. Do not flatten disagreement — name it. Then give a synthesis and a recommended decision the user can act on.`,
  inputSchema: z.object({
    question: z.string(),
    positions: z.array(z.object({ advisor: z.string(), recommendation: z.string(), confidence: scoreField })).min(1),
  }),
  outputSchema: z.object({
    summary: z.string(),
    agreements: z.array(z.string()).default([]),
    disagreements: z.array(z.string()).default([]),
    keyRisks: z.array(z.string()).default([]),
    recommendedDecision: z.string(),
    confidence: scoreField,
  }),
  buildUserPrompt: (i) =>
    `Decision: ${i.question}\nAdvisor positions:\n${i.positions.map((p) => `- ${p.advisor}: ${p.recommendation} (${Math.round(p.confidence * 100)}%)`).join("\n")}\nName agreements, disagreements, key risks, a synthesis, and a recommended decision.`,
  example: {
    input: { question: "Take the manager role or stay an IC?", positions: [{ advisor: "Leverage Advisor", recommendation: "Stay IC if it compounds rarer skill.", confidence: 0.6 }, { advisor: "Effectiveness Advisor", recommendation: "Take it if it multiplies others.", confidence: 0.6 }] },
    output: { summary: "The crux is which form of leverage compounds faster for you now.", agreements: ["Both judge it by leverage, not title."], disagreements: ["Rare-skill leverage vs leverage-through-others."], keyRisks: ["Managing may cap rising specific knowledge."], recommendedDecision: "Take the role only if it multiplies a result you can't reach alone; otherwise deepen the rare skill first.", confidence: 0.62 },
  },
});

export const DecisionMemoWriter = defineAgent({
  name: "DecisionMemoWriter",
  description: "Write a concise decision memo from the board's synthesis.",
  system: `${BASE_TONE} Write a crisp decision memo. Be concrete about options, hidden assumptions, reversibility, the recommended next step, and when to review.`,
  inputSchema: z.object({
    question: z.string(),
    recommendedDecision: z.string(),
    keyRisks: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    options: z.array(z.string()).default([]),
    hiddenAssumptions: z.array(z.string()).default([]),
    reversibility: z.string(),
    recommendedNextStep: z.string(),
    reviewInDays: z.number().int(),
  }),
  buildUserPrompt: (i) =>
    `Decision: ${i.question}\nRecommended: ${i.recommendedDecision}\nKnown risks: ${i.keyRisks.join("; ") || "(none)"}\nWrite the options, hidden assumptions, reversibility, the recommended next step, and a review horizon in days.`,
  example: {
    input: { question: "Take the manager role or stay an IC?", recommendedDecision: "Take it only if it multiplies a result you can't reach alone.", keyRisks: ["Caps rising specific knowledge."] },
    output: { options: ["Accept now", "Decline and deepen IC skill", "Negotiate a hybrid lead role"], hiddenAssumptions: ["That management is the only path to impact here."], reversibility: "Largely reversible within 6 months.", recommendedNextStep: "Trial-lead one project for a month before committing.", reviewInDays: 30 },
  },
});
