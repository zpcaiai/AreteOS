// Management OS — scoring. Pure [0,1] functions.
import { clamp01 } from "../scoring";

const mean = (xs: number[]) => (xs.length ? clamp01(xs.reduce((a, b) => a + clamp01(b), 0) / xs.length) : 0);

export function managementMaturityScore(i: {
  mission: number; leadership: number; knowledge: number; decisionQuality: number;
  delegation: number; alignment: number; resilience: number;
}): number {
  return mean(Object.values(i));
}

/** Leverage score: weight time by tier (low=1, medium=2, high=3), normalize to [0,1]. */
export function leverageScore(i: { lowShare: number; mediumShare: number; highShare: number }): number {
  const total = clamp01(i.lowShare) + clamp01(i.mediumShare) + clamp01(i.highShare);
  if (total <= 0) return 0;
  const weighted = clamp01(i.lowShare) * 1 + clamp01(i.mediumShare) * 2 + clamp01(i.highShare) * 3;
  return clamp01(weighted / (total * 3));
}

export function knowledgeWorkerScore(i: {
  clarity: number; autonomy: number; capability: number; tooling: number; focus: number;
}): number {
  return mean(Object.values(i));
}

export function decisionGovernanceScore(i: {
  quality: number; consistency: number; speed: number; ownership: number; learning: number;
}): number {
  return mean(Object.values(i));
}

export function organizationalHealthScore(i: {
  trust: number; communication: number; execution: number; ownership: number; learning: number; collaboration: number;
}): number {
  return mean(Object.values(i));
}

/** Resilience: 1 − average dependency/concentration (lower concentration = more anti-fragile). */
export function resilienceScore(i: {
  founderDependency: number; keyPersonDependency: number; customerConcentration: number;
  knowledgeConcentration: number; productConcentration: number;
}): number {
  return clamp01(1 - mean(Object.values(i)));
}

/** Dependency risk = the average concentration (the denominator of the global formula). */
export function dependencyRisk(i: {
  founderDependency: number; keyPersonDependency: number; customerConcentration: number;
  knowledgeConcentration: number; productConcentration: number;
}): number {
  return mean(Object.values(i));
}

export interface MgmtInputs {
  leverage: number; knowledge: number; alignment: number;
  decisionQuality: number; health: number; resilience: number; dependencyRisk: number;
}

/**
 * Global Management Score =
 *   (Leverage × Knowledge × Alignment × DecisionQuality × Health × Resilience) ÷ DependencyRisk
 * Dependency divides; modeled as (1 - risk) to keep the result in [0,1].
 */
export function globalManagementScore(i: MgmtInputs): number {
  const product =
    clamp01(i.leverage) * clamp01(i.knowledge) * clamp01(i.alignment) *
    clamp01(i.decisionQuality) * clamp01(i.health) * clamp01(i.resilience);
  const independence = clamp01(1 - clamp01(i.dependencyRisk));
  return clamp01(product * (0.5 + 0.5 * independence));
}
