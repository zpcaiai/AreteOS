// MISSION OS — Personality Evolution State Machine.
// Eight stages, each with a goal that gates the transition to the next. A stage
// advances when its gating signal (derived from scores/events) clears a threshold.

import type { EvolutionStage } from "../domain/enums";
import { EVOLUTION_STAGES } from "../domain/enums";

export interface StageSpec {
  stage: EvolutionStage;
  characteristics: string[];
  goal: string;
  /** Which signal must clear `threshold` to advance to the next stage. */
  gate: keyof StageSignals;
  threshold: number;
}

/** Signals fed into the machine (all 0..1), assembled from scores + activity. */
export interface StageSignals {
  awareness: number;        // reflection cadence + shadow awareness
  valuesDiscovered: number; // values ranked, strengths identified
  identityClarity: number;  // identity alignment / clarity
  habitConsistency: number;
  decisionQuality: number;
  mastery: number;
  leadership: number;
  legacy: number;
}

export const STAGE_SPECS: StageSpec[] = [
  { stage: "UNAWARE", characteristics: ["reactive", "distracted", "short-term driven"], goal: "Awareness", gate: "awareness", threshold: 0.4 },
  { stage: "EXPLORER", characteristics: ["searching direction"], goal: "Discover strengths & values", gate: "valuesDiscovered", threshold: 0.5 },
  { stage: "BUILDER", characteristics: ["choosing identity"], goal: "Identity formation", gate: "identityClarity", threshold: 0.6 },
  { stage: "OPERATOR", characteristics: ["executing consistently"], goal: "Habit formation", gate: "habitConsistency", threshold: 0.65 },
  { stage: "STRATEGIST", characteristics: ["systems thinking", "long-term"], goal: "Decision optimization", gate: "decisionQuality", threshold: 0.65 },
  { stage: "CREATOR", characteristics: ["building value"], goal: "Mastery", gate: "mastery", threshold: 0.7 },
  { stage: "LEADER", characteristics: ["scaling impact"], goal: "Influence", gate: "leadership", threshold: 0.7 },
  { stage: "LEGACY_BUILDER", characteristics: ["transferring wisdom"], goal: "Institution building", gate: "legacy", threshold: 0.7 },
];

const SPEC_BY_STAGE = Object.fromEntries(STAGE_SPECS.map((s) => [s.stage, s])) as Record<EvolutionStage, StageSpec>;

export function stageIndex(stage: EvolutionStage): number {
  return EVOLUTION_STAGES.indexOf(stage);
}

export interface StageEvaluation {
  current: EvolutionStage;
  next: EvolutionStage | null;
  goal: string;
  gate: keyof StageSignals;
  gateValue: number;
  threshold: number;
  /** progress toward this stage's goal, 0..1 */
  progress: number;
  shouldAdvance: boolean;
}

/** Evaluate whether the user should advance, given the current stage + signals. */
export function evaluateStage(current: EvolutionStage, signals: StageSignals): StageEvaluation {
  const spec = SPEC_BY_STAGE[current];
  const idx = stageIndex(current);
  const next = idx < EVOLUTION_STAGES.length - 1 ? EVOLUTION_STAGES[idx + 1] : null;
  const gateValue = signals[spec.gate] ?? 0;
  const progress = Math.min(1, spec.threshold > 0 ? gateValue / spec.threshold : 1);
  return {
    current,
    next,
    goal: spec.goal,
    gate: spec.gate,
    gateValue,
    threshold: spec.threshold,
    progress,
    shouldAdvance: next !== null && gateValue >= spec.threshold,
  };
}
