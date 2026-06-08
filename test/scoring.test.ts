import { describe, it, expect } from "vitest";

import { clamp01, growthScore, valueIntegrityScore, firstPrincipleScore } from "../src/lib/scoring";
import { globalCognitiveScore, biasResistanceScore, modelDiversityScore } from "../src/lib/phronesis/scoring";
import { leverageScore as mgmtLeverage, globalManagementScore, dependencyRisk } from "../src/lib/oikos/scoring";
import { leverageScore as ldrLeverage, globalLeadershipScore } from "../src/lib/archon/scoring";
import { replicationReadinessScore, founderDependencyScore, repeatabilityScore } from "../src/lib/praxis/scoring";
import { coherenceScore, clarityScore, globalWorldviewScore } from "../src/lib/cosmos/scoring";
import { globalChildScore, environmentScore, resilienceScore as childResilience } from "../src/lib/genius/scoring";
import { identityClarityScore, identityConflictScore, globalIdentityScore } from "../src/lib/ethos/scoring";

const inUnit = (x: number) => x >= 0 && x <= 1;

describe("core/scoring", () => {
  it("clamp01 bounds + NaN guard", () => {
    expect(clamp01(2)).toBe(1);
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(0.42)).toBe(0.42);
    expect(clamp01(NaN)).toBe(0);
  });

  it("valueIntegrityScore guards divide-by-zero", () => {
    expect(valueIntegrityScore({ alignedDecisions: 0, totalDecisions: 0 })).toBe(0);
    expect(valueIntegrityScore({ alignedDecisions: 3, totalDecisions: 6 })).toBe(0.5);
  });

  it("growthScore is a geometric mean: all-1 → 1, any-0 collapses it", () => {
    const all = { mission: 1, identity: 1, values: 1, mentalModels: 1, firstPrinciples: 1, decisions: 1, habits: 1, reflection: 1, mastery: 1 };
    expect(growthScore(all)).toBeCloseTo(1, 5);
    const oneZero = { ...all, mission: 0 };
    expect(growthScore(oneZero)).toBeLessThan(0.5);
    expect(inUnit(growthScore(oneZero))).toBe(true);
  });

  it("firstPrincipleScore stays in [0,1]", () => {
    expect(inUnit(firstPrincipleScore({ assumptionsTested: 2, assumptionsTotal: 4, rootCausesFound: 2 }))).toBe(true);
    expect(inUnit(firstPrincipleScore({ assumptionsTested: 0, assumptionsTotal: 0, rootCausesFound: 0 }))).toBe(true);
  });
});

describe("phronesis (cognitive)", () => {
  it("modelDiversity normalizes by category count", () => {
    expect(modelDiversityScore(9, 9)).toBe(1);
    expect(modelDiversityScore(0, 9)).toBe(0);
  });
  it("biasResistance: no events is a non-perfect default, severe events lower it", () => {
    expect(biasResistanceScore([])).toBeCloseTo(0.7, 5);
    expect(biasResistanceScore([{ severity: 1 }, { severity: 1 }])).toBe(0);
  });
  it("globalCognitiveScore in unit, all-1/dep-0 → 1", () => {
    const hi = { modelDiversity: 1, judgment: 1, decisionQuality: 1, biasResistance: 1, reflection: 1, wisdom: 1, blindSpotLoad: 0 };
    expect(globalCognitiveScore(hi)).toBeCloseTo(1, 5);
    expect(inUnit(globalCognitiveScore({ ...hi, blindSpotLoad: 1 }))).toBe(true);
  });
});

describe("oikos (management) leverage weighting", () => {
  it("all-high → 1, all-low → 1/3", () => {
    expect(mgmtLeverage({ lowShare: 0, mediumShare: 0, highShare: 1 })).toBeCloseTo(1, 5);
    expect(mgmtLeverage({ lowShare: 1, mediumShare: 0, highShare: 0 })).toBeCloseTo(1 / 3, 5);
  });
  it("globalManagementScore in unit", () => {
    const i = { leverage: 0.6, knowledge: 0.6, alignment: 0.6, decisionQuality: 0.6, health: 0.6, resilience: 0.6, dependencyRisk: 0.4 };
    expect(inUnit(globalManagementScore(i))).toBe(true);
  });
  it("dependencyRisk averages concentration dims", () => {
    expect(dependencyRisk({ founderDependency: 1, keyPersonDependency: 1, customerConcentration: 1, knowledgeConcentration: 1, productConcentration: 1 })).toBe(1);
  });
});

describe("archon (leadership) leverage levels", () => {
  it("only-mission → 1, only-environment → ~1/6", () => {
    const z = { environment: 0, behavior: 0, capability: 0, belief: 0, identity: 0, mission: 0 };
    expect(ldrLeverage({ ...z, mission: 1 })).toBeCloseTo(1, 5);
    expect(ldrLeverage({ ...z, environment: 1 })).toBeCloseTo(1 / 6, 5);
  });
  it("globalLeadershipScore in unit", () => {
    expect(inUnit(globalLeadershipScore({ missionAlignment: 0.7, identityAlignment: 0.7, visionAlignment: 0.6, belonging: 0.6, readiness: 0.5, blindSpotLoad: 0.4 }))).toBe(true);
  });
});

describe("praxis (SFM)", () => {
  it("empty factor lists → 0", () => {
    expect(founderDependencyScore([])).toBe(0);
    expect(repeatabilityScore([])).toBe(0);
  });
  it("replicationReadiness: all-1 / dep-0 → 1, stays in unit", () => {
    const i = { repeatability: 1, valuesAlignment: 1, decisionConsistency: 1, collaborationQuality: 1, leadershipMaturity: 1, resilience: 1, founderDependency: 0 };
    expect(replicationReadinessScore(i)).toBeCloseTo(1, 5);
    expect(inUnit(replicationReadinessScore({ ...i, founderDependency: 1, repeatability: 0.3 }))).toBe(true);
  });
});

describe("cosmos (worldview)", () => {
  it("coherence default with no conflicts is high but not perfect", () => {
    expect(coherenceScore([])).toBeCloseTo(0.8, 5);
    expect(coherenceScore([{ severity: 1 }])).toBe(0);
  });
  it("clarity + global in unit", () => {
    const d = { reality: 0.6, humanNature: 0.6, meaning: 0.6, success: 0.6, failure: 0.6, responsibility: 0.6, time: 0.6, change: 0.6, risk: 0.6, purpose: 0.6 };
    expect(clarityScore(d)).toBeCloseTo(0.6, 5);
    expect(inUnit(globalWorldviewScore({ clarity: 0.6, coherence: 0.6, assumptionAwareness: 0.6, meaning: 0.6, missionAlignment: 0.6, identityAlignment: 0.6, wisdom: 0.6 }))).toBe(true);
  });
});

describe("genius (child)", () => {
  it("environmentScore inverts noise/distraction (lower noise = healthier)", () => {
    const quiet = environmentScore({ noise: 0, distraction: 0, autonomy: 1, exploration: 1, accessibility: 1 });
    const noisy = environmentScore({ noise: 1, distraction: 1, autonomy: 1, exploration: 1, accessibility: 1 });
    expect(quiet).toBeGreaterThan(noisy);
    expect(quiet).toBeCloseTo(1, 5);
  });
  it("globalChildScore geometric: all-1 → 1, any-0 collapses, in unit", () => {
    const all = { explorer: 1, creator: 1, builder: 1, researcher: 1, problemSolver: 1, resilience: 1, autonomy: 1, growthMindset: 1, parentSupport: 1 };
    expect(globalChildScore(all)).toBeCloseTo(1, 5);
    expect(globalChildScore({ ...all, resilience: 0 })).toBeLessThan(0.5);
  });
  it("childResilience averages its four dims", () => {
    expect(childResilience({ failureRecovery: 1, persistence: 1, riskTaking: 1, emotionalRegulation: 1 })).toBe(1);
  });
});

describe("ethos (identity)", () => {
  it("clarity scales with stack size (full at 4)", () => {
    expect(identityClarityScore(4)).toBe(1);
    expect(identityClarityScore(2)).toBe(0.5);
  });
  it("conflict score: none → 1, severe → lower", () => {
    expect(identityConflictScore([])).toBe(1);
    expect(identityConflictScore([{ severity: 1 }])).toBe(0);
  });
  it("globalIdentityScore in unit", () => {
    expect(inUnit(globalIdentityScore({ clarity: 0.6, alignment: 0.6, stability: 0.6, conflict: 0.6, evolution: 0.6, integration: 0.6 }))).toBe(true);
  });
});
