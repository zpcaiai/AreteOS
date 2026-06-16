// Specific Knowledge flagship service: score factors, compute the rare-combination
// graph (pure), then run the two agents. Persisted as a domain event.

import { prisma } from "./db";
import { emit } from "./events";
import { moatScore, rareCombinations, specificKnowledgeScore, type RareCombo, type SkFactors, type SkSignal } from "./specific-knowledge-math";
import { AssetOpportunityGenerator, RareCombinationAnalyzer } from "./agents/specific-knowledge";

export interface SkResult {
  score: number;
  moat: number;
  factors: SkFactors;
  market: number;
  signals: SkSignal[];
  combos: RareCombo[];
  analysis: Awaited<ReturnType<typeof RareCombinationAnalyzer.run>>;
  opportunities: Awaited<ReturnType<typeof AssetOpportunityGenerator.run>>;
}

export async function assessSpecificKnowledge(
  userId: string,
  input: { signals?: SkSignal[]; factors: SkFactors; market?: number; context?: string },
): Promise<SkResult> {
  const signals = input.signals ?? [];
  const market = input.market ?? input.factors.marketRelevance ?? 0.5;
  const score = specificKnowledgeScore(input.factors);
  const moat = moatScore(signals, market);
  const combos = rareCombinations(signals, market, 6);

  const analysis = await RareCombinationAnalyzer.run({ signals: signals.map((s) => ({ label: s.label, kind: s.kind })), market, context: input.context ?? "" });
  const opportunities = await AssetOpportunityGenerator.run({ rareCombination: analysis.rareCombinationStatement, primaryDomain: analysis.primaryDomain, context: input.context ?? "" });

  await emit({
    userId,
    aggregateType: "SpecificKnowledge",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `sk_${Date.now()}`,
    type: "SpecificKnowledgeAssessed",
    payload: { score, moat, primaryDomain: analysis.primaryDomain, rareCombination: analysis.rareCombinationStatement, ninetyDayTarget: opportunities.ninetyDayTarget },
  }).catch(() => {});

  return { score, moat, factors: input.factors, market, signals, combos, analysis, opportunities };
}

export async function latestSpecificKnowledge(userId: string) {
  const row = await prisma.domainEvent.findFirst({
    where: { userId, aggregateType: "SpecificKnowledge", type: "SpecificKnowledgeAssessed" },
    orderBy: { occurredAt: "desc" },
    select: { payload: true, occurredAt: true },
  });
  if (!row) return null;
  return { ...(row.payload as Record<string, unknown>), at: row.occurredAt.getTime() };
}


export async function specificKnowledgeHistory(userId: string, limit = 20): Promise<number[]> {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "SpecificKnowledge", type: "SpecificKnowledgeAssessed" },
    orderBy: { occurredAt: "asc" }, take: limit, select: { payload: true },
  });
  return rows.map((r) => Number((r.payload as Record<string, unknown>).score) || 0);
}
