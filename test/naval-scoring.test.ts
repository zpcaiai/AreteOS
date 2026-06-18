import { describe, it, expect } from "vitest";
import {
  specificKnowledgeScore, leverageScore, judgmentScore, longTermGameScore,
  happinessScore, globalNavalScore, buildSnapshot,
} from "../src/lib/naval/scoring";

describe("naval scoring — geometric mean of 0..1 factors → 0..100", () => {
  it("all factors = 1 → 100", () => {
    expect(specificKnowledgeScore({ curiosityDepth: 1, skillRarity: 1, marketRelevance: 1, personalEnergy: 1, compounding: 1 })).toBe(100);
  });
  it("all factors = 0.5 → 50", () => {
    expect(specificKnowledgeScore({ curiosityDepth: 0.5, skillRarity: 0.5, marketRelevance: 0.5, personalEnergy: 0.5, compounding: 0.5 })).toBe(50);
  });
  it("a single zero factor tanks the score", () => {
    expect(leverageScore({ scalability: 0, ownership: 1, automation: 1, distribution: 1, compounding: 1 })).toBeLessThan(20);
  });
  it("judgment is monotonic in its factors", () => {
    const f = (x: number) => judgmentScore({ predictionAccuracy: x, assumptionQuality: x, modelUsage: x, emotionalDiscipline: x, learningRate: x });
    expect(f(0.8)).toBeGreaterThan(f(0.3));
  });
  it("long-term game divides by (1 + short-term trap risk)", () => {
    const base = { compounding: 1, identityAlignment: 1, relationshipQuality: 1, reputationUpside: 1, learningRate: 1 };
    expect(longTermGameScore({ ...base, shortTermTrapRisk: 0 })).toBe(100);
    expect(longTermGameScore({ ...base, shortTermTrapRisk: 1 })).toBe(50);
  });
  it("happiness divides by (1 + desire load)", () => {
    const base = { peace: 1, health: 1, relationships: 1, autonomy: 1, gratitude: 1 };
    expect(happinessScore({ ...base, desireLoad: 0 })).toBe(100);
    expect(happinessScore({ ...base, desireLoad: 1 })).toBe(50);
  });
  it("global naval score = geo mean of seven 0..100 sub-scores", () => {
    const all = (v: number) => globalNavalScore({ specificKnowledge: v, judgment: v, leverage: v, wealthCreation: v, freedom: v, happiness: v, lifePortfolio: v });
    expect(all(100)).toBe(100);
    expect(all(50)).toBe(50);
  });
  it("buildSnapshot attaches globalScore + preserves sub-scores", () => {
    const snap = buildSnapshot({ specificKnowledge: 80, judgment: 80, leverage: 80, wealthCreation: 80, freedom: 80, happiness: 80, lifePortfolio: 80, talentStack: 70, longTermGame: 60 });
    expect(snap.globalScore).toBe(80);
    expect(snap.talentStack).toBe(70);
  });
});
