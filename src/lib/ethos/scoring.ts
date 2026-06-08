// Identity Library — scoring. Pure [0,1] functions.
import { clamp01 } from "../scoring";
import { STAGE_INDEX, STAGES, type Stage } from "./constants";

/** Identity Clarity: are the primary identities named and stated? (0..1 from how complete the stack is). */
export function identityClarityScore(stackSize: number): number {
  return clamp01(stackSize / 4); // primary + secondary + emerging + legacy = full clarity
}

/** Identity Alignment: how well the stack supports the mission (caller supplies 0..1). */
export function identityAlignmentScore(missionSupport: number): number {
  return clamp01(missionSupport);
}

/** Identity Stability: average evolution-stage progress across the stack. */
export function identityStabilityScore(stages: Stage[]): number {
  if (stages.length === 0) return 0;
  const maxIdx = STAGES.length - 1;
  return clamp01(stages.reduce((a, s) => a + STAGE_INDEX[s] / maxIdx, 0) / stages.length);
}

/** Identity Conflict: 1 − normalized conflict load (more/severe conflicts = lower). */
export function identityConflictScore(conflicts: { severity: number }[]): number {
  if (conflicts.length === 0) return 1;
  const load = conflicts.reduce((a, c) => a + clamp01(c.severity), 0) / conflicts.length;
  return clamp01(1 - load);
}

/** Identity Evolution: how many snapshots show forward movement (caller supplies a 0..1 momentum). */
export function identityEvolutionScore(momentum: number): number {
  return clamp01(momentum);
}

/** Identity Integration: clarity × conflict-resolution × stability (a stack that fits together). */
export function identityIntegrationScore(i: { clarity: number; conflict: number; stability: number }): number {
  return clamp01(clamp01(i.clarity) * clamp01(i.conflict) * clamp01(i.stability) ** 0.5);
}

export interface IdentityScores {
  clarity: number; alignment: number; stability: number; conflict: number; evolution: number; integration: number;
}

/** Global Identity Score: geometric mean of the six component scores. */
export function globalIdentityScore(i: IdentityScores): number {
  const terms = [i.clarity, i.alignment, i.stability, i.conflict, i.evolution, i.integration].map(clamp01);
  const prod = terms.reduce((a, b) => a * Math.max(b, 1e-6), 1);
  return clamp01(Math.pow(prod, 1 / terms.length));
}
