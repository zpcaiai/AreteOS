import { describe, expect, it } from "vitest";
import { moatScore, rareCombinations, specificKnowledgeScore, type SkSignal } from "../src/lib/specific-knowledge-math";

const sigs: SkSignal[] = [
  { label: "systems thinking", kind: "talent", intensity: 0.9, rarity: 0.8 },
  { label: "hands-on teaching", kind: "experience", intensity: 0.8, rarity: 0.7 },
  { label: "casual cooking", kind: "curiosity", intensity: 0.4, rarity: 0.2 },
];

describe("specific knowledge math", () => {
  it("averages the six factors", () => {
    expect(specificKnowledgeScore({ curiosityDepth: 0.6, experienceDepth: 0.6, skillRarity: 0.6, energy: 0.6, marketRelevance: 0.6, compoundingPotential: 0.6 })).toBeCloseTo(60, 0);
  });
  it("ranks rare combinations and excludes none", () => {
    const c = rareCombinations(sigs, 0.7, 6);
    expect(c).toHaveLength(3);
    expect(c[0].score).toBeGreaterThanOrEqual(c[c.length - 1].score);
    expect(c[0].defensibility).toBeGreaterThan(0.7);
  });
  it("computes a positive moat and handles no signals", () => {
    expect(moatScore(sigs, 0.7)).toBeGreaterThan(0);
    expect(rareCombinations([], 0.5)).toEqual([]);
  });
});
