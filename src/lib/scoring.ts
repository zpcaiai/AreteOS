// MISSION OS — scoring. All scores are pure functions in [0, 1] so they are
// unit-testable and replayable from the event log.

export const clamp01 = (x: number): number => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);

/** Mission Alignment = clarity × how consistently recent action served the mission. */
export function missionAlignmentScore(input: { clarity: number; actionConsistency: number }): number {
  return clamp01(clamp01(input.clarity) * clamp01(input.actionConsistency));
}

/** Identity Alignment = identity clarity × values consistency × behavior↔identity match. */
export function identityAlignmentScore(input: {
  clarity: number;
  valuesConsistency: number;
  behaviorMatch: number;
}): number {
  return clamp01(clamp01(input.clarity) * clamp01(input.valuesConsistency) * clamp01(input.behaviorMatch));
}

/** Value Integrity = share of recent decisions consistent with the top-ranked values. */
export function valueIntegrityScore(input: { alignedDecisions: number; totalDecisions: number }): number {
  if (input.totalDecisions <= 0) return 0;
  return clamp01(input.alignedDecisions / input.totalDecisions);
}

/** Mental Model Usage = distinct models actually applied / models known (capped at 1). */
export function mentalModelUsageScore(input: { modelsApplied: number; modelsKnown: number }): number {
  if (input.modelsKnown <= 0) return 0;
  return clamp01(input.modelsApplied / input.modelsKnown);
}

/** First Principle = how much reasoning was grounded (assumptions tested, root causes found). */
export function firstPrincipleScore(input: {
  assumptionsTested: number;
  assumptionsTotal: number;
  rootCausesFound: number; // 0..(many)
}): number {
  const tested = input.assumptionsTotal > 0 ? input.assumptionsTested / input.assumptionsTotal : 0;
  const depth = clamp01(input.rootCausesFound / 3); // ~3 layers of "why" = solid
  return clamp01(0.6 * tested + 0.4 * depth);
}

/**
 * Decision Quality (single decision review). Positives are fit/EV/2nd-order/
 * reversibility; negatives are risk, opportunity cost and shadow motive.
 */
export function decisionQualityScore(r: {
  missionFit: number;
  identityFit: number;
  valueFit: number;
  expectedValue: number;
  secondOrder: number;
  reversibility: number;
  risk: number;
  opportunityCost: number;
  shadowMotive: number;
}): number {
  const positive =
    0.22 * clamp01(r.missionFit) +
    0.18 * clamp01(r.identityFit) +
    0.18 * clamp01(r.valueFit) +
    0.20 * clamp01(r.expectedValue) +
    0.12 * clamp01(r.secondOrder) +
    0.10 * clamp01(r.reversibility);
  const penalty = 0.5 * clamp01(r.risk) + 0.3 * clamp01(r.opportunityCost) + 0.6 * clamp01(r.shadowMotive);
  return clamp01(positive - penalty * 0.5);
}

/** Habit Consistency = completions / target over the window (e.g. last 30 days). */
export function habitConsistencyScore(input: { completions: number; target: number }): number {
  if (input.target <= 0) return 0;
  return clamp01(input.completions / input.target);
}

/** Mastery = weighted blend of the four sub-dimensions, lifted by stage. */
export function masteryScore(input: {
  knowledge: number;
  execution: number;
  problemSolving: number;
  teaching: number;
}): number {
  return clamp01(
    0.3 * clamp01(input.knowledge) +
      0.3 * clamp01(input.execution) +
      0.25 * clamp01(input.problemSolving) +
      0.15 * clamp01(input.teaching),
  );
}

/** Leadership = mean of the leadership sub-metrics. */
export function leadershipScore(m: {
  communication: number;
  influence: number;
  delegation: number;
  teamBuilding: number;
  decisionQuality: number;
}): number {
  const vals = [m.communication, m.influence, m.delegation, m.teamBuilding, m.decisionQuality].map(clamp01);
  return clamp01(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/** Legacy = normalized contribution beyond self (mentees, assets, institutions). */
export function legacyScore(input: { mentees: number; knowledgeAssets: number; institutions: number }): number {
  // saturating: diminishing returns past a healthy baseline.
  const sat = (n: number, k: number) => clamp01(n / (n + k));
  return clamp01(0.4 * sat(input.mentees, 3) + 0.35 * sat(input.knowledgeAssets, 5) + 0.25 * sat(input.institutions, 1));
}

/** Reflection = average reflection depth over the period × cadence adherence. */
export function reflectionScore(input: { avgDepth: number; daysReflected: number; daysInPeriod: number }): number {
  const cadence = input.daysInPeriod > 0 ? input.daysReflected / input.daysInPeriod : 0;
  return clamp01(clamp01(input.avgDepth) * (0.5 + 0.5 * clamp01(cadence)));
}

/**
 * Global Growth Score. The spec defines it as a product of the core factors; we
 * use the **geometric mean** (the product normalized to [0,1]) so the score stays
 * comparable but still collapses if any single layer is neglected — you cannot
 * fake growth by maxing one axis.
 */
export function growthScore(factors: {
  mission: number;
  identity: number;
  values: number;
  mentalModels: number;
  firstPrinciples: number;
  decisions: number;
  habits: number;
  reflection: number;
  mastery: number;
}): number {
  const vals = Object.values(factors).map(clamp01);
  const eps = 1e-6;
  const logSum = vals.reduce((acc, v) => acc + Math.log(Math.max(v, eps)), 0);
  return clamp01(Math.exp(logSum / vals.length));
}

// ── Measurement validity: confidence + uncertainty ────────────────────────────
// The scores above are point estimates, often from thin, self-reported evidence.
// These helpers attach honest uncertainty so the UI can show "73% ±12% (n=4)"
// instead of false precision. All pure, all in [0,1]. (Additive — no existing
// signature changes.)

/** Wilson score interval for a proportion (k successes of n). Robust at small n. */
export function wilsonInterval(k: number, n: number, z = 1.96): { low: number; mid: number; high: number } {
  if (n <= 0) return { low: 0, mid: 0, high: 1 };
  const p = clamp01(k / n);
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { low: clamp01(center - margin), mid: clamp01(center), high: clamp01(center + margin) };
}

/** Confidence from sample size: 0 at n=0, → 1 as n grows (half at n=k). */
export function sampleConfidence(n: number, k = 10): number {
  if (n <= 0) return 0;
  return clamp01(n / (n + k));
}

export interface ScoreWithConfidence {
  value: number;
  confidence: number;
  low: number;
  high: number;
  samples: number;
}

/** Wrap a score with a confidence band that widens when evidence is thin. */
export function withConfidence(value: number, samples: number, k = 10): ScoreWithConfidence {
  const v = clamp01(value);
  const confidence = sampleConfidence(samples, k);
  const halfWidth = (1 - confidence) * 0.5; // up to ±0.5 when there is no evidence
  return { value: v, confidence, low: clamp01(v - halfWidth), high: clamp01(v + halfWidth), samples };
}

/** Confidence of a geometric-mean composite = geometric mean of its parts' confidence. */
export function compositeConfidence(confidences: number[]): number {
  if (confidences.length === 0) return 0;
  const eps = 1e-6;
  const logSum = confidences.reduce((a, c) => a + Math.log(Math.max(clamp01(c), eps)), 0);
  return clamp01(Math.exp(logSum / confidences.length));
}
