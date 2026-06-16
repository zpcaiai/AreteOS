// Mentor Council orchestrator. Runs the panel of lens-agents on one question, in
// parallel, then measures how much they actually agree (a real, testable signal)
// before the moderator synthesizes. The disagreement is the product, not a bug.

import { Council_munger, Council_drucker, Council_naval, Council_dalio, Council_musk, CouncilModerator } from "./agents/council";
import { COUNCIL_PERSONAS } from "./council-personas";
import { consensusMetrics, type ConsensusMetrics } from "./council-math";
import { emit } from "./events";

export { consensusMetrics, tokenize, jaccard } from "./council-math";
export type { ConsensusMetrics } from "./council-math";

const COUNCIL_MEMBERS = [
  { persona: COUNCIL_PERSONAS[0], agent: Council_munger },
  { persona: COUNCIL_PERSONAS[1], agent: Council_drucker },
  { persona: COUNCIL_PERSONAS[2], agent: Council_naval },
  { persona: COUNCIL_PERSONAS[3], agent: Council_dalio },
  { persona: COUNCIL_PERSONAS[4], agent: Council_musk },
] as const;

export interface CouncilPosition {
  key: string;
  persona: string;
  stance: string;
  reasoning: string;
  keyRisk: string;
  recommendation: string;
  confidence: number;
}

export interface CouncilResult {
  question: string;
  positions: CouncilPosition[];
  metrics: ConsensusMetrics;
  synthesis: Awaited<ReturnType<typeof CouncilModerator.run>>;
}

export async function runCouncil(
  userId: string,
  input: { question: string; context?: string; options?: string[] },
): Promise<CouncilResult> {
  const { question, context = "", options = [] } = input;

  const positions: CouncilPosition[] = await Promise.all(
    COUNCIL_MEMBERS.map(async ({ persona, agent }) => {
      const out = await agent.run({ question, context, options });
      return { key: persona.key, persona: persona.name, ...out };
    }),
  );

  const metrics = consensusMetrics(positions);
  const synthesis = await CouncilModerator.run({
    question,
    positions: positions.map((p) => ({ persona: p.persona, stance: p.stance, recommendation: p.recommendation, confidence: p.confidence })),
  });

  await emit({
    userId,
    aggregateType: "Council",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `council_${Date.now()}`,
    type: "CouncilConvened",
    payload: { question, agreement: metrics.agreement, polarization: metrics.confidencePolarization, decision: synthesis.recommendedDecision },
  }).catch(() => {});

  return { question, positions, metrics, synthesis };
}
