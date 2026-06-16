// Personal Boardroom — 10 advisor lenses + shared schemas. Kept out of agents/* so
// the registry's `export *` only ever re-exports Agent instances.

import { z } from "zod";
import { scoreField } from "./agents/_shared";

export const advisorInputSchema = z.object({
  question: z.string(),
  context: z.string().default(""),
  options: z.array(z.string()).default([]),
});

export const advisorOutputSchema = z.object({
  analysis: z.string(),
  keyRisk: z.string(),
  opportunity: z.string(),
  recommendation: z.string(),
  confidence: scoreField,
});

export interface Advisor {
  key: string;
  name: string;
  lens: string;
  exemplar: { analysis: string; recommendation: string; risk: string; opportunity: string };
}

export const ADVISORS: Advisor[] = [
  { key: "identity", name: "Identity Advisor", lens: "Ask whether this aligns with who the user is becoming (logical levels of identity).", exemplar: { analysis: "This serves the title more than the identity you said you wanted.", recommendation: "Choose the option that proves the identity, not the status.", risk: "Optimizing for a role that contradicts your becoming.", opportunity: "A decision that compounds your stated identity." } },
  { key: "mental_model", name: "Mental Model Advisor", lens: "Apply a latticework of models; name which apply and which the user is missing.", exemplar: { analysis: "You're using a single model where incentives and second-order effects dominate.", recommendation: "Run it through inversion and incentives before deciding.", risk: "Man-with-a-hammer bias.", opportunity: "A more robust decision from multiple models." } },
  { key: "first_principle", name: "First-Principle Challenger", lens: "Strip to fundamental constraints; question every assumption.", exemplar: { analysis: "Most of your constraints are inherited, not fundamental.", recommendation: "Rebuild the option from the few things that must be true.", risk: "Optimizing a requirement that should be deleted.", opportunity: "A cheaper, simpler path from fundamentals." } },
  { key: "effectiveness", name: "Effectiveness Advisor", lens: "Judge by contribution and results, not effort.", exemplar: { analysis: "The real question is what result would make this worthwhile.", recommendation: "Pick the option that concentrates strength on one result.", risk: "Being busy instead of effective.", opportunity: "Outsized contribution from focus." } },
  { key: "leverage", name: "Leverage Advisor", lens: "Optimize for leverage, optionality, and long-term compounding.", exemplar: { analysis: "One path compounds; the other is a one-time reward.", recommendation: "Take the option with asymmetric upside and capped downside.", risk: "Trading a compounding asset for cash now.", opportunity: "Permissionless, compounding leverage." } },
  { key: "risk", name: "Risk Advisor", lens: "Find what can break; protect against fragility and ruin.", exemplar: { analysis: "The downside here is larger and less reversible than it looks.", recommendation: "Cap the worst case before chasing the upside.", risk: "A small probability of ruin.", opportunity: "Antifragile positioning if downside is capped." } },
  { key: "bias", name: "Bias Detector", lens: "Surface the cognitive biases shaping the decision.", exemplar: { analysis: "Confirmation and recency are inflating your confidence.", recommendation: "Argue the opposite and check base rates first.", risk: "Mistaking conviction for evidence.", opportunity: "A cleaner read once biases are named." } },
  { key: "principle", name: "Principle Advisor", lens: "Check the decision against the user's stated principles.", exemplar: { analysis: "This quietly violates a principle you said was non-negotiable.", recommendation: "Decline anything that trades integrity for speed.", risk: "Eroding character for a short-term win.", opportunity: "A decision that strengthens your constitution." } },
  { key: "execution", name: "Execution Advisor", lens: "Translate the choice into an operating plan with leverage points.", exemplar: { analysis: "The decision is fine; there is no operating plan behind it.", recommendation: "Define the next 3 concrete moves and an owner for each.", risk: "A good decision dying for lack of execution.", opportunity: "Momentum from a crisp plan." } },
  { key: "reflection", name: "Reflection Advisor", lens: "Design how the decision will be reviewed and learned from.", exemplar: { analysis: "You haven't said how you'll know if this was right.", recommendation: "Pre-commit to a review date and the evidence you'll check.", risk: "Repeating the mistake because you never closed the loop.", opportunity: "Compounding judgment via reviewed decisions." } },
];
