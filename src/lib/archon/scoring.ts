// Leadership Leverage — scoring. Pure [0,1] functions.
import { clamp01 } from "../scoring";

export interface LeverageDistribution {
  environment: number; behavior: number; capability: number; belief: number; identity: number; mission: number;
}

/**
 * Leverage Score: weight attention by the leverage of the level it's spent at.
 * Higher levels (belief/identity/telos) count more. Returns 0..1.
 */
export function leverageScore(d: LeverageDistribution): number {
  const w = { environment: 1, behavior: 2, capability: 3, belief: 4, identity: 5, mission: 6 };
  const total = Object.values(d).reduce((a, b) => a + clamp01(b), 0);
  if (total <= 0) return 0;
  const weighted =
    clamp01(d.environment) * w.environment + clamp01(d.behavior) * w.behavior +
    clamp01(d.capability) * w.capability + clamp01(d.belief) * w.belief +
    clamp01(d.identity) * w.identity + clamp01(d.mission) * w.mission;
  return clamp01(weighted / (total * w.mission)); // normalize by max possible weight
}

export function belongingScore(i: {
  trust: number; psychologicalSafety: number; recognition: number;
  contribution: number; identityFit: number; missionFit: number;
}): number {
  const xs = [i.trust, i.psychologicalSafety, i.recognition, i.contribution, i.identityFit, i.missionFit].map(clamp01);
  return clamp01(xs.reduce((a, b) => a + b, 0) / xs.length);
}

export function leadershipMaturityScore(i: {
  selfAwareness: number; responsibility: number; communication: number;
  emotionalRegulation: number; decisionMaturity: number; integrity: number; peopleDevelopment: number;
}): number {
  const xs = Object.values(i).map(clamp01);
  return clamp01(xs.reduce((a, b) => a + b, 0) / xs.length);
}

export function alignmentScore(i: {
  mission: number; identity: number; values: number; decisionRules: number; behaviors: number; teams: number;
}): number {
  const xs = Object.values(i).map(clamp01);
  return clamp01(xs.reduce((a, b) => a + b, 0) / xs.length);
}

export function futureLeaderReadiness(i: {
  selfAwareness: number; decisionQuality: number; influence: number; responsibility: number;
  missionOwnership: number; identityStability: number; visionCapability: number;
}): number {
  const xs = Object.values(i).map(clamp01);
  return clamp01(xs.reduce((a, b) => a + b, 0) / xs.length);
}

/**
 * Global Leadership Score =
 *   (Mission × Identity × Vision × Belonging × Readiness) ÷ BlindSpots
 * Blind spots divide; we model them as (1 - blindSpotLoad) to stay in [0,1].
 */
export function globalLeadershipScore(i: {
  missionAlignment: number; identityAlignment: number; visionAlignment: number;
  belonging: number; readiness: number; blindSpotLoad: number; // 0..1, higher = more blind spots
}): number {
  const product =
    clamp01(i.missionAlignment) * clamp01(i.identityAlignment) * clamp01(i.visionAlignment) *
    clamp01(i.belonging) * clamp01(i.readiness);
  const clarity = clamp01(1 - clamp01(i.blindSpotLoad));
  return clamp01(product * (0.5 + 0.5 * clarity));
}
