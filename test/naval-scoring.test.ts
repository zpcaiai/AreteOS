import { describe, it, expect } from "vitest";
import {
  specificKnowledgeScore, leverageScore, judgmentScore, longTermGameScore,
  happinessScore, lifePortfolioScore, globalNavalScore, buildSnapshot,
} from "../src/lib/naval/scoring";

describe("naval scoring — geometric mean", () => {
  it("all-equal factors collapse to that value × 100", () => {
    const s = specificKnowledgeScore({ curiosityDepth: 0.5, skillRarity: 0.5, marketRelevance: 0.5, personalEnergy: 0.5, compounding: 0.5 });
    expect(s).toBe(50);
  });

  it("stays within 0..100", () => {
    const s = leverageScore({ scalability: 0.9, ownership: 0.8, automation: 0.7, distribution: 0.6, compounding: 0.5 });
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });

  it("a near-zero factor tanks the whole score (geometric, not arithmetic)", () => {
    const strong = judgmentScore({ predictionAccuracy: 0.9, assumptionQuality: 0.9, modelUsage: 0.9, emotionalDiscipline: 0.9, learningRate: 0.9 });
    const oneWeak = judgmentScore({ predictionAccuracy: 0.9, assumptionQuality: 0.9, modelUsage: 0.9, emotionalDiscipline: 0.9, learningRate: 0.02 });
    expect(oneWeak).toBeLessThan(strong / 2);
  });

  it("clamps out-of-range inputs", () => {
    const s = lifePortfolioScore({ health: 2, wealth: 1, relationships: 1, mission: 1, freedom: 1, happiness: 1, learning: 1 });
    expect(s).toBe(100); // all clamp to 1 → geo mean 1 → 100
  });
});

describe("naval scoring — penalty divisors", () => {
  it("long-term game score divides by (1 + short-term trap risk)", () => {
    const base = { compounding: 0.8, identityAlignment: 0.8, relationshipQuality: 0.8, reputationUpside: 0.8, learningRate: 0.8 };
    const safe = longTermGameScore({ ...base, shortTermTrapRisk: 0 });
    const trap = longTermGameScore({ ...base, shortTermTrapRisk: 1 });
    expect(trap).toBe(Math.round(safe / 2));
  });

  it("happiness score divides by (1 + desire load)", () => {
    const base = { peace: 0.8, health: 0.8, relationships: 0.8, autonomy: 0.8, gratitude: 0.8 };
    const calm = happinessScore({ ...base, desireLoad: 0 });
    const craving = happinessScore({ ...base, desireLoad: 1 });
    expect(craving).toBe(Math.round(calm / 2));
  });
});

describe("global naval score + snapshot", () => {
  it("global is the geometric mean of the seven 0..100 drivers", () => {
    const seven = { specificKnowledge: 64, judgment: 64, leverage: 64, wealthCreation: 64, freedom: 64, happiness: 64, lifePortfolio: 64 };
    expect(globalNavalScore(seven)).toBe(64);
  });

  it("buildSnapshot attaches a computed globalScore", () => {
    const snap = buildSnapshot({
      specificKnowledge: 50, talentStack: 50, leverage: 50, judgment: 50, wealthCreation: 50,
      longTermGame: 50, freedom: 50, happiness: 50, lifePortfolio: 50,
    });
    expect(snap.globalScore).toBe(50);
    expect(snap.talentStack).toBe(50);
  });
});
