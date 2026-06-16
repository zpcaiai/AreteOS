// Bottleneck Diagnosis service: rules first, AI refines, persist as a domain event.

import { prisma } from "./db";
import { emit } from "./events";
import { diagnose, type RankedBottleneck } from "./bottleneck-rules";
import { evidenceSignalsFromGaps } from "./evidence-math";
import { computeEvidenceGaps } from "./evidence";
import { BottleneckDiagnostician } from "./agents/bottleneck";

export interface BottleneckResult {
  ranked: RankedBottleneck[];
  diagnosis: Awaited<ReturnType<typeof BottleneckDiagnostician.run>>;
}

export async function diagnoseBottleneck(
  userId: string,
  input: { problemStatement?: string; signals?: string[]; useEvidence?: boolean },
): Promise<BottleneckResult> {
  let signals = input.signals ?? [];
  if (input.useEvidence) {
    try {
      const ev = await computeEvidenceGaps(userId, { withInterpretation: false });
      signals = [...new Set([...signals, ...evidenceSignalsFromGaps(ev.gaps)])];
    } catch { /* evidence is best-effort; ignore failures */ }
  }
  const ranked = diagnose(signals);
  const prelim = ranked.slice(0, 4).map((r) => ({ key: r.key, name: r.name.en, score: r.score }));
  const diagnosis = await BottleneckDiagnostician.run({ problemStatement: input.problemStatement ?? "", signals, prelim });

  await emit({
    userId,
    aggregateType: "Bottleneck",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `bn_${Date.now()}`,
    type: "BottleneckDiagnosed",
    payload: {
      problemStatement: input.problemStatement ?? "",
      primary: diagnosis.primaryBottleneck,
      secondary: diagnosis.secondaryBottlenecks,
      ranked: ranked.map((r) => ({ key: r.key, score: r.score })),
      recommendedNextEngine: diagnosis.recommendedNextEngine,
      recommendation: diagnosis.recommendation,
    },
  }).catch(() => {});

  return { ranked, diagnosis };
}

export async function latestBottleneck(userId: string) {
  const row = await prisma.domainEvent.findFirst({
    where: { userId, aggregateType: "Bottleneck", type: "BottleneckDiagnosed" },
    orderBy: { occurredAt: "desc" },
    select: { payload: true, occurredAt: true },
  });
  if (!row) return null;
  return { ...(row.payload as Record<string, unknown>), at: row.occurredAt.getTime() };
}
