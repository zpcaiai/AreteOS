// Evidence orchestrator. Ingested behavioral signals are stored as domain events
// (event sourcing), then aggregated into enacted levels and contrasted with the
// self-reported (stated) scores to expose the identity-behavior gap.

import { prisma } from "./db";
import { emit } from "./events";
import { computeScoresCached, type ScoreSet } from "./analytics";
import { aggregateEvidence, gapReport, overallIntegrity, type DomainGap, type EvidenceSignal } from "./evidence-math";
import { EvidenceInterpreter } from "./agents/evidence";

const DAY = 86_400_000;

export const EVIDENCE_KINDS = [
  "habits", "reflection", "decisions", "mentalModels", "mastery", "identity", "values", "mission", "firstPrinciples",
] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

const STATED_DOMAINS: [keyof ScoreSet, EvidenceKind][] = [
  ["habitConsistency", "habits"], ["reflection", "reflection"], ["decisionQuality", "decisions"],
  ["mentalModelUsage", "mentalModels"], ["mastery", "mastery"], ["identityAlignment", "identity"],
  ["valueIntegrity", "values"], ["missionAlignment", "mission"], ["firstPrinciple", "firstPrinciples"],
];

export async function ingestEvidence(userId: string, signals: EvidenceSignal[]): Promise<{ ingested: number }> {
  await Promise.all(
    signals.map((s) =>
      emit({ userId, aggregateType: "Evidence", aggregateId: `${s.source}:${s.kind}`, type: "EvidenceObserved", payload: s }).catch(() => {}),
    ),
  );
  return { ingested: signals.length };
}

async function loadSignals(userId: string, sinceDays: number): Promise<EvidenceSignal[]> {
  const since = new Date(Date.now() - sinceDays * DAY);
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "Evidence", type: "EvidenceObserved", occurredAt: { gte: since } },
    select: { payload: true, occurredAt: true },
  });
  return rows
    .map((r) => {
      const p = (r.payload ?? {}) as Record<string, unknown>;
      return {
        source: String(p.source ?? "manual"),
        kind: String(p.kind ?? ""),
        value: Number(p.value ?? 0),
        at: Number(p.at ?? r.occurredAt.getTime()),
      } as EvidenceSignal;
    })
    .filter((s) => s.kind);
}

export interface EvidenceGapResult {
  signals: number;
  integrity: number;
  gaps: DomainGap[];
  interpretation: Awaited<ReturnType<typeof EvidenceInterpreter.run>> | null;
}

export async function computeEvidenceGaps(
  userId: string,
  opts: { sinceDays?: number; halfLifeDays?: number; withInterpretation?: boolean } = {},
): Promise<EvidenceGapResult> {
  const signals = await loadSignals(userId, opts.sinceDays ?? 90);
  const enacted = aggregateEvidence(signals, Date.now(), opts.halfLifeDays ?? 21);
  const { scores } = await computeScoresCached(userId);

  const stated: Record<string, number> = {};
  for (const [k, d] of STATED_DOMAINS) stated[d] = scores[k];

  const gaps = gapReport(stated, enacted);
  const integrity = overallIntegrity(gaps);

  let interpretation: EvidenceGapResult["interpretation"] = null;
  if (opts.withInterpretation) {
    interpretation = await EvidenceInterpreter.run({
      overallIntegrity: integrity,
      gaps: gaps.filter((g) => g.samples > 0).map((g) => ({ domain: g.domain, stated: g.stated, enacted: g.enacted, gap: g.gap, samples: g.samples })),
    });
  }

  return { signals: signals.length, integrity, gaps, interpretation };
}
