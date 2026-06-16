// Shared scoring core for the 20 Skills-Library engines. One tested combinator
// handles every spec formula: arithmetic mean, geometric mean (any neglected
// factor tanks the whole score), or a bounded ratio (a "risk/dependency" factor
// drags the score down). All pure, all return 0..100.

export type ScoreMode = "mean" | "geomean" | "ratio";

export const clamp01 = (x: number): number => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);
export const round1 = (x: number): number => Math.round(x * 10) / 10;

export function mean01(xs: number[]): number {
  if (xs.length === 0) return 0;
  return clamp01(xs.reduce((s, x) => s + clamp01(x), 0) / xs.length);
}

export function geoMean01(xs: number[]): number {
  if (xs.length === 0) return 0;
  const eps = 1e-6;
  const logSum = xs.reduce((s, x) => s + Math.log(Math.max(clamp01(x), eps)), 0);
  return clamp01(Math.exp(logSum / xs.length));
}

/**
 * Bounded ratio: numerators combine by geometric mean, then a single denominator
 * ("risk"/"dependency"/"distraction") drags the result down. denom=0 → no drag,
 * denom=1 → halves the score. A bounded, monotonic interpretation of the specs'
 * "÷ risk" formulas (the literal division is unbounded and not a real 0..1 score).
 */
export function ratio01(numerators: number[], denom: number): number {
  return clamp01(geoMean01(numerators) * (1 - 0.5 * clamp01(denom)));
}

/**
 * Generic engine score in 0..100. `values` align with the engine's factor list;
 * for "ratio" mode, denomIndex marks the risk/dependency factor.
 */
export function scoreEngine(values: number[], mode: ScoreMode, denomIndex: number | null = null): number {
  if (mode === "mean") return mean01(values) * 100;
  if (mode === "geomean") return geoMean01(values) * 100;
  // ratio
  if (denomIndex == null || denomIndex < 0 || denomIndex >= values.length) {
    return geoMean01(values) * 100;
  }
  const numerators = values.filter((_, i) => i !== denomIndex);
  return ratio01(numerators, values[denomIndex]) * 100;
}
