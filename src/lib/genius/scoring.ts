// Child Development OS — scoring. Pure [0,1] functions. Never optimize for grades/obedience.
import { clamp01 } from "../scoring";

const mean = (xs: number[]) => (xs.length ? clamp01(xs.reduce((a, b) => a + clamp01(b), 0) / xs.length) : 0);

export function childAssessmentScore(i: {
  curiosity: number; creativity: number; resilience: number; autonomy: number;
  collaboration: number; problemSolving: number; identityClarity: number; learningMotivation: number;
}): number {
  return mean(Object.values(i));
}

export function environmentScore(i: { noise: number; distraction: number; autonomy: number; exploration: number; accessibility: number }): number {
  // noise & distraction are negatives; invert them
  const good = [1 - clamp01(i.noise), 1 - clamp01(i.distraction), i.autonomy, i.exploration, i.accessibility];
  return mean(good);
}

export function autonomyScore(i: { initiative: number; ownership: number; persistence: number; focus: number; independentLearning: number }): number {
  return mean(Object.values(i));
}

export function resilienceScore(i: { failureRecovery: number; persistence: number; riskTaking: number; emotionalRegulation: number }): number {
  return mean(Object.values(i));
}

export interface ChildInputs {
  explorer: number; creator: number; builder: number; researcher: number; problemSolver: number;
  resilience: number; autonomy: number; growthMindset: number; parentSupport: number;
}

/** Global Child Development Score: geometric mean — every capability counts, none dominates. */
export function globalChildScore(i: ChildInputs): number {
  const terms = Object.values(i).map(clamp01);
  const prod = terms.reduce((a, b) => a * Math.max(b, 1e-6), 1);
  return clamp01(Math.pow(prod, 1 / terms.length));
}
