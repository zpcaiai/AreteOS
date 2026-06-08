// Cognitive OS — scoring. Pure [0,1] functions. Optimizes judgment quality, not info quantity.
import { clamp01 } from "../scoring";

const mean = (xs: number[]) => (xs.length ? clamp01(xs.reduce((a, b) => a + clamp01(b), 0) / xs.length) : 0);

export function judgmentScore(i: {
  problemFraming: number; evidenceQuality: number; modelDiversity: number; biasResistance: number;
  longTermThinking: number; secondOrderThinking: number; riskAwareness: number; decisionClarity: number;
}): number {
  return mean(Object.values(i));
}

/** Model diversity: distinct categories of models the user actually applies, normalized. */
export function modelDiversityScore(distinctCategories: number, totalCategories = 9): number {
  return clamp01(distinctCategories / totalCategories);
}

/** Bias resistance: 1 − normalized recent bias load. */
export function biasResistanceScore(events: { severity: number }[]): number {
  if (events.length === 0) return 0.7; // no detected bias ≈ decent default, not perfect
  const load = events.reduce((a, e) => a + clamp01(e.severity), 0) / events.length;
  return clamp01(1 - load);
}

/** Decision quality: share of journaled decisions reviewed against outcomes. */
export function decisionQualityScore(i: { reviewed: number; total: number }): number {
  if (i.total <= 0) return 0;
  return clamp01(i.reviewed / i.total);
}

export function reflectionScore(i: { reviews: number; journals: number }): number {
  if (i.journals <= 0) return 0;
  return clamp01(i.reviews / i.journals);
}

export function uncertaintyScore(i: { robustness: number; optionality: number; tailRiskAwareness: number; fragility: number }): number {
  return clamp01(mean([i.robustness, i.optionality, i.tailRiskAwareness]) * (1 - clamp01(i.fragility) * 0.5));
}

export function wisdomScore(i: { insights: number; principles: number }): number {
  // diminishing returns; ~10 insights+principles ≈ strong
  return clamp01((i.insights + i.principles) / 10);
}

export interface CognitiveInputs {
  modelDiversity: number; judgment: number; decisionQuality: number;
  biasResistance: number; reflection: number; wisdom: number; blindSpotLoad: number;
}

/**
 * Global Cognitive Score =
 *  (ModelDiversity × Judgment × DecisionQuality × BiasResistance × Reflection × Wisdom) ÷ BlindSpots
 * Blind spots divide; modeled as (1 - load) to keep [0,1].
 */
export function globalCognitiveScore(i: CognitiveInputs): number {
  const product =
    clamp01(i.modelDiversity) * clamp01(i.judgment) * clamp01(i.decisionQuality) *
    clamp01(i.biasResistance) * clamp01(i.reflection) * clamp01(i.wisdom);
  const clarity = clamp01(1 - clamp01(i.blindSpotLoad));
  return clamp01(product * (0.5 + 0.5 * clarity));
}
