// Explainability: why is the Growth Score what it is, and what moves it most?
// Because Growth is a geometric mean, the lowest factor has the highest marginal
// leverage — raising your weakest layer beats polishing your strongest. Pure +
// testable; the UI can render "why did you say this" from this directly.

import { clamp01, growthScore } from "./scoring";
import type { FactorSet } from "./future-self-math";

export interface FactorContribution {
  factor: keyof FactorSet;
  value: number;
  /** Share of the total "drag" the geometric mean suffers, 0..1. */
  dragShare: number;
}

export interface GrowthExplanation {
  value: number;
  weakest: keyof FactorSet;
  strongest: keyof FactorSet;
  biggestLever: keyof FactorSet;
  projectedIfLeverPlus10: number;
  gainFromLever: number;
  contributions: FactorContribution[];
}

const EPS = 1e-6;

export function explainGrowth(factors: FactorSet): GrowthExplanation {
  const entries = Object.entries(factors) as [keyof FactorSet, number][];
  const value = growthScore(factors);

  const drags = entries.map(([k, v]) => ({ k, v: clamp01(v), drag: -Math.log(Math.max(clamp01(v), EPS)) }));
  const totalDrag = drags.reduce((s, d) => s + d.drag, 0) || 1;
  const contributions: FactorContribution[] = drags
    .map((d) => ({ factor: d.k, value: d.v, dragShare: d.drag / totalDrag }))
    .sort((a, b) => b.dragShare - a.dragShare);

  let weakest = entries[0][0];
  let strongest = entries[0][0];
  for (const [k, v] of entries) {
    if (clamp01(v) < clamp01(factors[weakest])) weakest = k;
    if (clamp01(v) > clamp01(factors[strongest])) strongest = k;
  }

  const lever = weakest;
  const bumped: FactorSet = { ...factors, [lever]: clamp01(factors[lever] + 0.1) };
  const projected = growthScore(bumped);

  return {
    value,
    weakest,
    strongest,
    biggestLever: lever,
    projectedIfLeverPlus10: projected,
    gainFromLever: projected - value,
    contributions,
  };
}
