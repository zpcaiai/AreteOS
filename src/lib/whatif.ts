// What-if engine: counterfactual simulation over the user's REAL current scores
// using the same pure scoring math as the live system. "If I held habit
// adherence at 90% and reviewed every decision for the next 90 days, where
// does my growth score land?" — deterministic, explainable, no LLM involved.

import { computeScoresCached, type ScoreSet } from "./analytics";
import { growthScore, clamp01 } from "./scoring";

export interface WhatIfIntervention {
  /** Target habit consistency 0..1 sustained over the horizon. */
  habitConsistency?: number;
  /** Target reflection score 0..1 sustained over the horizon. */
  reflection?: number;
  /** Target decision quality 0..1 (e.g. reviewing every major decision). */
  decisionQuality?: number;
  /** Target mental-model usage 0..1 (deliberately applying the latticework). */
  mentalModelUsage?: number;
  /** Target first-principles practice 0..1. */
  firstPrinciple?: number;
}

export interface WhatIfPoint {
  day: number;
  growth: number;
  factors: Record<string, number>;
}

export interface WhatIfResult {
  horizonDays: number;
  baseline: { growth: number; factors: Record<string, number> };
  projected: { growth: number; factors: Record<string, number> };
  delta: number;
  curve: WhatIfPoint[];
  /** Plain-language notes on what drives the change. */
  notes: string[];
}

/**
 * Skills approach targets along a saturating exponential — fast early gains,
 * diminishing returns — with a small decay pull when the target is below the
 * current level (skills atrophy without practice).
 */
function approach(current: number, target: number, day: number, horizon: number): number {
  const tau = horizon / 3; // ~95% of the move completes within the horizon
  const progress = 1 - Math.exp(-day / tau);
  return clamp01(current + (target - current) * progress);
}

const MUTABLE: (keyof ScoreSet)[] = ["habitConsistency", "reflection", "decisionQuality", "mentalModelUsage", "firstPrinciple"];

export async function simulateWhatIf(
  userId: string,
  intervention: WhatIfIntervention,
  horizonDays = 90,
): Promise<WhatIfResult> {
  const horizon = Math.min(Math.max(horizonDays, 7), 365);
  const { scores } = await computeScoresCached(userId);

  const targets: Partial<Record<keyof ScoreSet, number>> = {
    habitConsistency: intervention.habitConsistency,
    reflection: intervention.reflection,
    decisionQuality: intervention.decisionQuality,
    mentalModelUsage: intervention.mentalModelUsage,
    firstPrinciple: intervention.firstPrinciple,
  };

  const factorsAt = (day: number): Record<string, number> => {
    const f: Record<string, number> = {
      mission: scores.missionAlignment,
      identity: scores.identityAlignment,
      values: scores.valueIntegrity,
      mentalModels: scores.mentalModelUsage,
      firstPrinciples: scores.firstPrinciple,
      decisions: scores.decisionQuality,
      habits: scores.habitConsistency,
      reflection: scores.reflection,
      mastery: scores.mastery,
    };
    const apply = (factorKey: string, scoreKey: keyof ScoreSet) => {
      const target = targets[scoreKey];
      if (typeof target === "number") f[factorKey] = approach(scores[scoreKey], clamp01(target), day, horizon);
    };
    apply("habits", "habitConsistency");
    apply("reflection", "reflection");
    apply("decisions", "decisionQuality");
    apply("mentalModels", "mentalModelUsage");
    apply("firstPrinciples", "firstPrinciple");
    // Second-order effects: identity strengthens as habits prove it; mastery
    // compounds with deliberate practice signals (habits + reflection).
    const habitGain = f.habits - scores.habitConsistency;
    const practiceGain = (f.habits + f.reflection) / 2 - (scores.habitConsistency + scores.reflection) / 2;
    f.identity = clamp01(f.identity + 0.3 * Math.max(0, habitGain));
    f.mastery = clamp01(f.mastery + 0.25 * Math.max(0, practiceGain) * (day / horizon));
    return f;
  };

  const baselineFactors = factorsAt(0);
  const curve: WhatIfPoint[] = [];
  for (let day = 0; day <= horizon; day += Math.max(1, Math.round(horizon / 30))) {
    const f = factorsAt(day);
    curve.push({ day, growth: growthScore(f as Parameters<typeof growthScore>[0]), factors: f });
  }
  const final = curve[curve.length - 1];

  const notes: string[] = [];
  for (const key of MUTABLE) {
    const target = targets[key];
    if (typeof target === "number") {
      const direction = target > scores[key] ? "raises" : "lowers";
      notes.push(`Holding ${key} at ${(clamp01(target) * 100).toFixed(0)}% ${direction} it from ${(scores[key] * 100).toFixed(0)}% today.`);
    }
  }
  const deltaPct = (final.growth - curve[0].growth) * 100;
  if (Math.abs(deltaPct) >= 1) {
    notes.push(`Because the growth score is a geometric mean, ${deltaPct > 0 ? "lifting your weakest layers moves it most" : "letting any layer slide drags every other layer with it"}.`);
  }

  return {
    horizonDays: horizon,
    baseline: { growth: curve[0].growth, factors: baselineFactors },
    projected: { growth: final.growth, factors: final.factors },
    delta: final.growth - curve[0].growth,
    curve,
    notes,
  };
}
