// SFM — Business Scaling Engine scoring. Pure functions in [0,1] so they are
// unit-testable and replayable. Engineering language: every score is observable.
import { clamp01 } from "../scoring";

/** Mean of a list, 0 if empty. */
function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return clamp01(xs.reduce((a, b) => a + b, 0) / xs.length);
}

/** Founder Dependency: how much success still routes through the founder (lower is healthier). */
export function founderDependencyScore(factors: { founderDependencyScore: number }[]): number {
  return mean(factors.map((f) => clamp01(f.founderDependencyScore)));
}

/** Success Factor Repeatability: average repeatability across modeled factors. */
export function repeatabilityScore(factors: { repeatabilityScore: number }[]): number {
  return mean(factors.map((f) => clamp01(f.repeatabilityScore)));
}

/** Business Scalability: average scalability across modeled factors. */
export function scalabilityScore(factors: { scalabilityScore: number }[]): number {
  return mean(factors.map((f) => clamp01(f.scalabilityScore)));
}

/** Values Alignment: 1 − average dilution risk across core values. */
export function valuesAlignmentScore(values: { dilutionRisk: number }[]): number {
  if (values.length === 0) return 0;
  return clamp01(1 - mean(values.map((v) => clamp01(v.dilutionRisk))));
}

/** Decision Consistency: share of decisions covered by an explicit rule (capped). */
export function decisionConsistencyScore(input: { decisionsWithRule: number; decisionsTotal: number }): number {
  if (input.decisionsTotal <= 0) return 0;
  return clamp01(input.decisionsWithRule / input.decisionsTotal);
}

export function collaborationQualityScore(patterns: { score: number }[]): number {
  return mean(patterns.map((p) => clamp01(p.score)));
}

export function leadershipMaturityScore(patterns: { maturityScore: number }[]): number {
  return mean(patterns.map((p) => clamp01(p.maturityScore)));
}

export function resilienceScore(patterns: { score: number }[]): number {
  return mean(patterns.map((p) => clamp01(p.score)));
}

export interface SfmInputs {
  scalabilityFallback?: number;
  repeatability: number;
  valuesAlignment: number;
  decisionConsistency: number;
  collaborationQuality: number;
  leadershipMaturity: number;
  resilience: number;
  founderDependency: number; // 0..1, higher = more dependent (a drag)
}

/**
 * Replication Readiness =
 *   Repeatability × ValuesAlignment × DecisionConsistency × CollaborationQuality
 *   × LeadershipMaturity × Resilience ÷ FounderDependency
 * Founder dependency divides, so we use (1 - dependency) as the healthy term to
 * keep the result in [0,1] and avoid divide-by-zero while preserving the spec's intent.
 */
export function replicationReadinessScore(i: SfmInputs): number {
  const product =
    clamp01(i.repeatability) *
    clamp01(i.valuesAlignment) *
    clamp01(i.decisionConsistency) *
    clamp01(i.collaborationQuality) *
    clamp01(i.leadershipMaturity) *
    clamp01(i.resilience);
  const independence = clamp01(1 - clamp01(i.founderDependency));
  return clamp01(product * (0.5 + 0.5 * independence)); // dependency penalizes, never zeroes
}

/** Organizational Health: geometric-style mean of the healthy signals. */
export function organizationalHealthScore(i: SfmInputs): number {
  const terms = [
    i.repeatability, i.scalabilityFallback ?? i.repeatability, i.valuesAlignment,
    i.decisionConsistency, i.collaborationQuality, i.leadershipMaturity, i.resilience,
    1 - i.founderDependency,
  ].map(clamp01);
  // geometric mean
  const prod = terms.reduce((a, b) => a * Math.max(b, 1e-6), 1);
  return clamp01(Math.pow(prod, 1 / terms.length));
}
