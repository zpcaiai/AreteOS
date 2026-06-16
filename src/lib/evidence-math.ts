// Evidence-driven measurement. The system's scores are mostly self-reported; this
// turns passive BEHAVIORAL signals (calendar, git, journaling, workouts, decision
// reviews...) into an ENACTED level per domain, and contrasts it with the STATED
// level — the identity-behavior gap. Pure, time-decayed, testable.

import { clamp01 } from "./scoring";

export interface EvidenceSignal {
  source: string; // "calendar" | "git" | "journal" | "manual" | ...
  kind: string; // a domain key: habits | reflection | decisions | mentalModels | mastery | identity | values | mission | firstPrinciples
  value: number; // 0..1 normalized intensity of the behavior
  at: number; // epoch ms
}

export interface EnactedLevel {
  enacted: number; // 0..1 decay-weighted mean
  samples: number;
  weight: number; // total decay weight (confidence proxy)
}

/** Exponential time decay: a signal halves in influence every halfLifeDays. */
export function decayWeight(ageDays: number, halfLifeDays: number): number {
  const age = Math.max(0, ageDays);
  return Math.pow(0.5, age / Math.max(1, halfLifeDays));
}

/** Decay-weighted enacted level per kind/domain. */
export function aggregateEvidence(
  signals: EvidenceSignal[],
  now: number,
  halfLifeDays = 21,
): Record<string, EnactedLevel> {
  const acc: Record<string, { wv: number; w: number; n: number }> = {};
  for (const s of signals) {
    const ageDays = (now - s.at) / 86_400_000;
    const w = decayWeight(ageDays, halfLifeDays);
    const cur = acc[s.kind] ?? { wv: 0, w: 0, n: 0 };
    cur.wv += w * clamp01(s.value);
    cur.w += w;
    cur.n += 1;
    acc[s.kind] = cur;
  }
  const out: Record<string, EnactedLevel> = {};
  for (const [k, v] of Object.entries(acc)) {
    out[k] = { enacted: v.w > 0 ? clamp01(v.wv / v.w) : 0, samples: v.n, weight: v.w };
  }
  return out;
}

export interface DomainGap {
  domain: string;
  stated: number;
  enacted: number;
  /** stated - enacted: positive = you claim more than you enact (overclaim). */
  gap: number;
  /** 1 - |gap|: how well words and behavior agree. */
  integrity: number;
  samples: number;
}

export function identityBehaviorGap(stated: number, enacted: number): { gap: number; integrity: number } {
  const gap = clamp01(stated) - clamp01(enacted);
  return { gap, integrity: clamp01(1 - Math.abs(gap)) };
}

/** Pair each stated domain score with its enacted evidence level. */
export function gapReport(
  stated: Record<string, number>,
  enacted: Record<string, EnactedLevel>,
): DomainGap[] {
  const domains = new Set([...Object.keys(stated), ...Object.keys(enacted)]);
  const rows: DomainGap[] = [];
  for (const domain of domains) {
    const s = clamp01(stated[domain] ?? 0);
    const e = enacted[domain]?.enacted ?? 0;
    const { gap, integrity } = identityBehaviorGap(s, e);
    rows.push({ domain, stated: s, enacted: e, gap, integrity, samples: enacted[domain]?.samples ?? 0 });
  }
  // Biggest overclaim (positive gap) first.
  return rows.sort((a, b) => b.gap - a.gap);
}

/** Overall integrity = mean integrity across domains that have evidence. */
export function overallIntegrity(rows: DomainGap[]): number {
  const withEvidence = rows.filter((r) => r.samples > 0);
  if (withEvidence.length === 0) return 0;
  return clamp01(withEvidence.reduce((s, r) => s + r.integrity, 0) / withEvidence.length);
}


// ── Evidence → Bottleneck diagnosis ──────────────────────────────────────────
// Map a domain's overclaim (stated ≫ enacted) onto the bottleneck signals it most
// likely indicates, so behavioral evidence can drive diagnosis (not just self-report).
const GAP_SIGNALS: Record<string, string[]> = {
  habits: ["clearGoalsNoAction", "startsNoFinish"],
  reflection: ["stuckDespiteEffort", "noFeedbackLoop"],
  decisions: ["noFeedbackLoop"],
  mastery: ["manyHoursNoProgress"],
  mentalModels: ["manyHoursNoProgress"],
  identity: ["unclearIdentity"],
  values: ["valuesConflict"],
  mission: ["unclearWhy"],
  firstPrinciples: [],
};

/** Bottleneck signal keys implied by significant identity-behavior gaps (overclaims). */
export function evidenceSignalsFromGaps(gaps: DomainGap[], minGap = 0.25): string[] {
  const out = new Set<string>();
  for (const g of gaps) {
    if (g.samples > 0 && g.gap >= minGap) for (const sig of GAP_SIGNALS[g.domain] ?? []) out.add(sig);
  }
  return [...out];
}
