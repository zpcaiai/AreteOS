// Personal Boardroom service: run the advisor lenses in parallel, measure how much
// they agree (reusing the Mentor Council consensus math), synthesize, and write a
// decision memo. Persisted as a domain event.

import { prisma } from "./db";
import { emit } from "./events";
import { ADVISOR_AGENTS, BoardroomSynthesizer, DecisionMemoWriter } from "./agents/boardroom";
import { ADVISORS } from "./boardroom-personas";
import { consensusMetrics, type ConsensusMetrics } from "./council-math";

export interface AdvisorPosition {
  key: string;
  advisor: string;
  analysis: string;
  keyRisk: string;
  opportunity: string;
  recommendation: string;
  confidence: number;
}

export interface BoardroomResult {
  question: string;
  positions: AdvisorPosition[];
  metrics: ConsensusMetrics;
  synthesis: Awaited<ReturnType<typeof BoardroomSynthesizer.run>>;
  memo: Awaited<ReturnType<typeof DecisionMemoWriter.run>>;
}

export async function runBoardroom(
  userId: string,
  input: { question: string; context?: string; options?: string[]; advisors?: string[] },
): Promise<BoardroomResult> {
  const { question, context = "", options = [] } = input;
  const keys = (input.advisors && input.advisors.length ? input.advisors : ADVISORS.map((a) => a.key)).filter((k) => ADVISOR_AGENTS[k]);

  const positions: AdvisorPosition[] = await Promise.all(
    keys.map(async (k) => {
      const meta = ADVISORS.find((a) => a.key === k)!;
      const out = await ADVISOR_AGENTS[k].run({ question, context, options });
      return { key: k, advisor: meta.name, ...out };
    }),
  );

  const metrics = consensusMetrics(positions.map((p) => ({ persona: p.advisor, recommendation: p.recommendation, confidence: p.confidence })));
  const synthesis = await BoardroomSynthesizer.run({ question, positions: positions.map((p) => ({ advisor: p.advisor, recommendation: p.recommendation, confidence: p.confidence })) });
  const memo = await DecisionMemoWriter.run({ question, recommendedDecision: synthesis.recommendedDecision, keyRisks: synthesis.keyRisks });

  await emit({
    userId,
    aggregateType: "Boardroom",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `br_${Date.now()}`,
    type: "BoardroomConvened",
    payload: { question, advisors: keys, agreement: metrics.agreement, recommendedDecision: synthesis.recommendedDecision, reviewInDays: memo.reviewInDays },
  }).catch(() => {});

  return { question, positions, metrics, synthesis, memo };
}

export async function listBoardroomSessions(userId: string, limit = 20) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "Boardroom", type: "BoardroomConvened" },
    orderBy: { occurredAt: "desc" },
    take: Math.min(Math.max(limit, 1), 100),
    select: { payload: true, occurredAt: true },
  });
  return rows.map((r) => ({ ...(r.payload as Record<string, unknown>), at: r.occurredAt.getTime() }));
}
