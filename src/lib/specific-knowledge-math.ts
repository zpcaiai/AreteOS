// Specific Knowledge (flagship) — pure scoring + rare-combination graph. Specific
// knowledge is a rare INTERSECTION; this scores the six factors and finds the
// most defensible, market-relevant combinations of the user's signals (the graph
// the UI visualizes). No I/O imports; fully unit-testable.

import { clamp01, geoMean01, mean01, round1 } from "./skills-scoring";

export type SignalKind = "curiosity" | "talent" | "experience" | "obsession" | "market";

export interface SkSignal {
  label: string;
  kind: SignalKind;
  intensity: number; // 0..1
  rarity: number; // 0..1 how hard to replicate
}

export interface SkFactors {
  curiosityDepth: number;
  experienceDepth: number;
  skillRarity: number;
  energy: number;
  marketRelevance: number;
  compoundingPotential: number;
}

export function specificKnowledgeScore(f: SkFactors): number {
  return round1(mean01([f.curiosityDepth, f.experienceDepth, f.skillRarity, f.energy, f.marketRelevance, f.compoundingPotential]) * 100);
}

export interface RareCombo {
  a: string;
  b: string;
  defensibility: number; // 0..1, geomean of the two rarities
  marketFit: number; // 0..1
  score: number; // 0..1 overall
}

/** All signal pairs scored as rare combinations; defensibility × market fit. */
export function rareCombinations(signals: SkSignal[], market: number, k = 6): RareCombo[] {
  const m = clamp01(market);
  const out: RareCombo[] = [];
  for (let i = 0; i < signals.length; i += 1) {
    for (let j = i + 1; j < signals.length; j += 1) {
      const defensibility = geoMean01([signals[i].rarity, signals[j].rarity]);
      const score = geoMean01([defensibility, m, geoMean01([signals[i].intensity, signals[j].intensity])]);
      out.push({ a: signals[i].label, b: signals[j].label, defensibility, marketFit: m, score });
    }
  }
  out.sort((x, y) => y.score - x.score || (x.a + x.b).localeCompare(y.a + y.b));
  return out.slice(0, k);
}

/** Overall defensibility of the top combination (the moat indicator). */
export function moatScore(signals: SkSignal[], market: number): number {
  const top = rareCombinations(signals, market, 1)[0];
  return round1((top?.score ?? 0) * 100);
}
