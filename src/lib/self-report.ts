// Life-outcome self-report service. Persists periodic check-ins and computes longitudinal
// deltas vs the user's personal baseline (their first check-in). Uses raw SQL against
// self_reports so it doesn't depend on the generated Prisma model; reads are resilient.

import { prisma } from "./db";
import { reportError } from "./logger";
import { OUTCOME_KEYS, SELF_REPORT_MIN, SELF_REPORT_MAX } from "./self-report-catalog";

const clampInt = (n: number) => Math.max(SELF_REPORT_MIN, Math.min(SELF_REPORT_MAX, Math.round(n)));

export interface MetricProgress {
  metric: string;
  baseline: number;
  latest: number;
  delta: number;
  checkins: number;
}
export interface OutcomeSeriesPoint { metric: string; value: number; at: number }
export interface OutcomeProgress {
  hasBaseline: boolean;
  totalCheckins: number;
  lastCheckinAt: number | null;
  metrics: MetricProgress[];
  series: OutcomeSeriesPoint[];
}

/** Save one check-in (one row per rated dimension). Marks the first-ever check-in as the baseline. */
export async function saveCheckin(
  userId: string,
  ratings: Record<string, number>,
  note?: string,
): Promise<{ saved: number; isBaseline: boolean }> {
  const entries = Object.entries(ratings).filter(([k]) => OUTCOME_KEYS.includes(k));
  if (entries.length === 0) return { saved: 0, isBaseline: false };

  const prior = await prisma.$queryRaw<{ n: bigint }[]>`
    SELECT count(*)::bigint AS n FROM self_reports WHERE "userId" = ${userId}
  `;
  const isBaseline = Number(prior[0]?.n ?? 0) === 0;

  let saved = 0;
  for (const [metric, raw] of entries) {
    const id = globalThis.crypto?.randomUUID?.() ?? `sr_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await prisma.$executeRaw`
      INSERT INTO self_reports ("id", "userId", "metric", "value", "note", "isBaseline", "occurredAt")
      VALUES (${id}, ${userId}, ${metric}, ${clampInt(Number(raw))}, ${note ?? null}, ${isBaseline}, now())
    `;
    saved += 1;
  }
  return { saved, isBaseline };
}

/** Per-metric baseline vs latest, plus a recent series for sparklines. Resilient to a missing table. */
export async function outcomeProgress(userId: string, seriesLimit = 120): Promise<OutcomeProgress> {
  const empty: OutcomeProgress = { hasBaseline: false, totalCheckins: 0, lastCheckinAt: null, metrics: [], series: [] };
  try {
    const [agg, series, meta] = await Promise.all([
      prisma.$queryRaw<{ metric: string; baseline: number; latest: number; n: bigint }[]>`
        SELECT "metric",
          (array_agg("value" ORDER BY "occurredAt" ASC))[1]  AS baseline,
          (array_agg("value" ORDER BY "occurredAt" DESC))[1] AS latest,
          count(*)::bigint AS n
        FROM self_reports WHERE "userId" = ${userId}
        GROUP BY "metric"
      `,
      prisma.$queryRaw<{ metric: string; value: number; at: Date }[]>`
        SELECT "metric", "value", "occurredAt" AS at
        FROM self_reports WHERE "userId" = ${userId}
        ORDER BY "occurredAt" ASC
        LIMIT ${seriesLimit}
      `,
      prisma.$queryRaw<{ n: bigint; last: Date | null }[]>`
        SELECT count(DISTINCT date_trunc('second', "occurredAt"))::bigint AS n, max("occurredAt") AS last
        FROM self_reports WHERE "userId" = ${userId}
      `,
    ]);
    const metrics = agg.map((r) => ({
      metric: r.metric,
      baseline: Number(r.baseline),
      latest: Number(r.latest),
      delta: Number(r.latest) - Number(r.baseline),
      checkins: Number(r.n),
    }));
    return {
      hasBaseline: metrics.length > 0,
      totalCheckins: Number(meta[0]?.n ?? 0),
      lastCheckinAt: meta[0]?.last ? new Date(meta[0].last).getTime() : null,
      metrics,
      series: series.map((s) => ({ metric: s.metric, value: Number(s.value), at: new Date(s.at).getTime() })),
    };
  } catch (e) {
    reportError(e, { surface: "self-report", op: "progress" });
    return empty;
  }
}
