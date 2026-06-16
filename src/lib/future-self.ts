// Future-Self orchestrator: real current scores -> Monte Carlo distribution ->
// (optional) a grounded letter from the future self. Persists a domain event.

import { computeScoresCached, type ScoreSet } from "./analytics";
import { simulateFutureSelf, weakestFactor, type FactorSet, type Policy, type MonteCarloResult } from "./future-self-math";
import { FutureSelfAgent } from "./agents/future";
import { emit } from "./events";

export function scoresToFactors(s: ScoreSet): FactorSet {
  return {
    mission: s.missionAlignment,
    identity: s.identityAlignment,
    values: s.valueIntegrity,
    mentalModels: s.mentalModelUsage,
    firstPrinciples: s.firstPrinciple,
    decisions: s.decisionQuality,
    habits: s.habitConsistency,
    reflection: s.reflection,
    mastery: s.mastery,
  };
}

export interface FutureSelfInput {
  horizonMonths?: number;
  runs?: number;
  volatility?: number;
  threshold?: number;
  withLetter?: boolean;
  policy?: Policy;
}

export interface FutureSelfResult {
  horizonMonths: number;
  monteCarlo: MonteCarloResult;
  weakestLayer: keyof FactorSet;
  letter: Awaited<ReturnType<typeof FutureSelfAgent.run>> | null;
}

export async function projectFutureSelf(userId: string, input: FutureSelfInput = {}): Promise<FutureSelfResult> {
  const horizonMonths = Math.min(Math.max(input.horizonMonths ?? 12, 1), 120);
  const { scores } = await computeScoresCached(userId);
  const factors = scoresToFactors(scores);

  const monteCarlo = simulateFutureSelf({
    factors,
    policy: input.policy ?? {},
    horizonDays: horizonMonths * 30,
    runs: input.runs ?? 1500,
    volatility: input.volatility ?? 0.06,
    threshold: input.threshold,
    seed: 0x51ed270b,
  });

  const weakestLayer = weakestFactor(factors);

  let letter: FutureSelfResult["letter"] = null;
  if (input.withLetter) {
    const policyLabels = Object.entries(input.policy ?? {}).map(([k, v]) => `hold ${k} at ${Math.round((v as number) * 100)}%`);
    letter = await FutureSelfAgent.run({
      horizonMonths,
      currentGrowth: monteCarlo.baselineGrowth,
      expectedGrowth: monteCarlo.expectedGrowth,
      p10: monteCarlo.p10,
      p90: monteCarlo.p90,
      probAboveThreshold: monteCarlo.probAboveThreshold,
      weakestLayer,
      policy: policyLabels,
    });
  }

  await emit({
    userId,
    aggregateType: "FutureSelf",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `future_${Date.now()}`,
    type: "FutureSelfProjected",
    payload: { horizonMonths, expectedGrowth: monteCarlo.expectedGrowth, p10: monteCarlo.p10, p90: monteCarlo.p90, probAboveThreshold: monteCarlo.probAboveThreshold },
  }).catch(() => {});

  return { horizonMonths, monteCarlo, weakestLayer, letter };
}
