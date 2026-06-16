// Future-Self Monte Carlo. The /twin what-if is a single deterministic line; this
// projects a DISTRIBUTION of trajectories under a sustained policy + uncertainty,
// so the user sees p10/p50/p90 outcomes and "probability you beat today", not a
// false-precision single number. Pure + seeded → deterministic and testable.

import { clamp01, growthScore } from "./scoring";

export interface FactorSet {
  mission: number;
  identity: number;
  values: number;
  mentalModels: number;
  firstPrinciples: number;
  decisions: number;
  habits: number;
  reflection: number;
  mastery: number;
}

/** Sustained target levels (0..1) for the factors the user can move. */
export type Policy = Partial<FactorSet>;

export interface MonteCarloResult {
  runs: number;
  horizonDays: number;
  baselineGrowth: number;
  /** Deterministic (noise-free) projection of growth at the horizon. */
  expectedGrowth: number;
  p10: number;
  p50: number;
  p90: number;
  mean: number;
  threshold: number;
  /** Share of simulated trajectories whose final growth >= threshold. */
  probAboveThreshold: number;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  if (sortedAsc.length === 1) return sortedAsc[0];
  const idx = clamp01(p) * (sortedAsc.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo];
  return sortedAsc[lo] + (sortedAsc[hi] - sortedAsc[lo]) * (idx - lo);
}

function approach(current: number, target: number, day: number, horizon: number): number {
  const tau = horizon / 3;
  const progress = 1 - Math.exp(-day / tau);
  return clamp01(current + (target - current) * progress);
}

const MUTABLE: (keyof FactorSet)[] = ["habits", "reflection", "decisions", "mentalModels", "firstPrinciples"];

/** Project factors to the horizon under the policy, with optional per-factor noise. */
function projectFactors(base: FactorSet, policy: Policy, horizon: number, noise: number, rng: () => number): FactorSet {
  const f: FactorSet = { ...base };
  for (const key of MUTABLE) {
    const target = policy[key];
    if (typeof target === "number") {
      const drift = approach(base[key], clamp01(target), horizon, horizon);
      f[key] = clamp01(drift + (noise > 0 ? gaussian(rng) * noise : 0));
    } else if (noise > 0) {
      f[key] = clamp01(base[key] + gaussian(rng) * noise * 0.5);
    }
  }
  // Second-order: identity is proven by sustained habits; mastery compounds with practice.
  const habitGain = f.habits - base.habits;
  const practiceGain = (f.habits + f.reflection) / 2 - (base.habits + base.reflection) / 2;
  f.identity = clamp01(f.identity + 0.3 * Math.max(0, habitGain));
  f.mastery = clamp01(f.mastery + 0.25 * Math.max(0, practiceGain));
  return f;
}

export interface SimInput {
  factors: FactorSet;
  policy?: Policy;
  horizonDays?: number;
  runs?: number;
  volatility?: number;
  threshold?: number;
  seed?: number;
}

export function simulateFutureSelf(input: SimInput): MonteCarloResult {
  const horizonDays = Math.min(Math.max(input.horizonDays ?? 180, 7), 3650);
  const runs = Math.min(Math.max(input.runs ?? 1000, 1), 20000);
  const volatility = Math.min(Math.max(input.volatility ?? 0.06, 0), 0.5);
  const policy = input.policy ?? {};
  const rng = mulberry32(input.seed ?? 0x9e3779b9);

  const baselineGrowth = growthScore(input.factors);
  const expectedGrowth = growthScore(projectFactors(input.factors, policy, horizonDays, 0, rng));
  const threshold = input.threshold ?? baselineGrowth;

  const finals: number[] = new Array(runs);
  let above = 0;
  for (let i = 0; i < runs; i += 1) {
    const g = growthScore(projectFactors(input.factors, policy, horizonDays, volatility, rng));
    finals[i] = g;
    if (g >= threshold) above += 1;
  }
  finals.sort((a, b) => a - b);
  const mean = finals.reduce((s, x) => s + x, 0) / runs;

  return {
    runs,
    horizonDays,
    baselineGrowth,
    expectedGrowth,
    p10: percentile(finals, 0.1),
    p50: percentile(finals, 0.5),
    p90: percentile(finals, 0.9),
    mean,
    threshold,
    probAboveThreshold: above / runs,
  };
}

export function weakestFactor(f: FactorSet): keyof FactorSet {
  const keys = Object.keys(f) as (keyof FactorSet)[];
  return keys.reduce((min, k) => (f[k] < f[min] ? k : min), keys[0]);
}
