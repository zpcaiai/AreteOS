// Worldview OS — scoring. Pure [0,1] functions.
import { clamp01 } from "../scoring";

const mean = (xs: number[]) => (xs.length ? clamp01(xs.reduce((a, b) => a + clamp01(b), 0) / xs.length) : 0);

export interface Dimensions {
  reality: number; humanNature: number; meaning: number; success: number; failure: number;
  responsibility: number; time: number; change: number; risk: number; purpose: number;
}

/** Clarity: average stance-clarity across the ten dimensions. */
export function clarityScore(d: Dimensions): number {
  return mean(Object.values(d));
}

/** Coherence: 1 − normalized conflict load between values and assumptions. */
export function coherenceScore(conflicts: { severity: number }[]): number {
  if (conflicts.length === 0) return 0.8;
  const load = conflicts.reduce((a, c) => a + clamp01(c.severity), 0) / conflicts.length;
  return clamp01(1 - load);
}

export function meaningScore(m: {
  work: number; learning: number; relationships: number; contribution: number; mastery: number; legacy: number;
}): number {
  return mean(Object.values(m));
}

export interface WorldviewInputs {
  clarity: number; coherence: number; assumptionAwareness: number;
  meaning: number; missionAlignment: number; identityAlignment: number; wisdom: number;
}

/** Global Worldview Score: geometric mean of the component scores. */
export function globalWorldviewScore(i: WorldviewInputs): number {
  const terms = [i.clarity, i.coherence, i.assumptionAwareness, i.meaning, i.missionAlignment, i.identityAlignment, i.wisdom].map(clamp01);
  const prod = terms.reduce((a, b) => a * Math.max(b, 1e-6), 1);
  return clamp01(Math.pow(prod, 1 / terms.length));
}
