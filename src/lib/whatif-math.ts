// Pure math for the what-if engine — no DB / analytics dependency, so it can be
// imported and unit-tested in isolation (mirrors council-math, future-self-math, etc.).

import { clamp01 } from "./scoring";

/**
 * Skills approach targets along a saturating exponential — fast early gains,
 * then diminishing returns — reaching ~95% of the move within the horizon.
 */
export function approach(current: number, target: number, day: number, horizon: number): number {
  const tau = horizon / 3; // ~95% of the move completes within the horizon
  const progress = 1 - Math.exp(-day / tau);
  return clamp01(current + (target - current) * progress);
}
