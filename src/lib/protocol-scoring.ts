// Growth Protocol scoring. The protocol is a 7-stage loop; the global score is the
// geometric mean of the stage scores, so an incomplete or neglected stage tanks it
// (you can't fake a growth loop by maxing one stage). Pure + testable.

import { clamp01, geoMean01, round1 } from "./skills-scoring";

export const PROTOCOL_STAGES = ["observe", "diagnose", "design", "practice", "reflect", "update", "compound"] as const;
export type ProtocolStage = (typeof PROTOCOL_STAGES)[number];

export function scoreProtocol(stageScores: Partial<Record<ProtocolStage, number>>): number {
  const vals = PROTOCOL_STAGES.map((s) => clamp01(stageScores[s] ?? 0));
  return round1(geoMean01(vals) * 100);
}

/** Completion 0..100: how many of the 7 stages have been recorded. */
export function protocolProgress(recordedStages: ProtocolStage[]): number {
  const set = new Set(recordedStages.filter((s) => (PROTOCOL_STAGES as readonly string[]).includes(s)));
  return Math.round((set.size / PROTOCOL_STAGES.length) * 100);
}

export function nextStage(recordedStages: ProtocolStage[]): ProtocolStage | null {
  const set = new Set(recordedStages);
  return PROTOCOL_STAGES.find((s) => !set.has(s)) ?? null;
}
