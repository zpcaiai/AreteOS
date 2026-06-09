/* Naval Life OS — scoring. The spec's formulas are products of 0..1 factors;
   a raw product of many factors collapses toward 0, so each score is the
   GEOMETRIC MEAN of its factors × 100 (keeps "all factors matter" semantics
   while staying interpretable on 0..100). Pure functions — unit-testable. */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** geometric mean of factors, each 0..1 → 0..100 (a near-zero factor still tanks it). */
function geo(...factors: number[]): number {
  const fs = factors.map(clamp01).filter((f) => !Number.isNaN(f));
  if (!fs.length) return 0;
  const logSum = fs.reduce((a, f) => a + Math.log(Math.max(f, 1e-6)), 0);
  return Math.round(Math.exp(logSum / fs.length) * 100);
}

export interface SpecificKnowledgeFactors { curiosityDepth: number; skillRarity: number; marketRelevance: number; personalEnergy: number; compounding: number; }
export const specificKnowledgeScore = (f: SpecificKnowledgeFactors) =>
  geo(f.curiosityDepth, f.skillRarity, f.marketRelevance, f.personalEnergy, f.compounding);

export interface TalentStackFactors { skillDiversity: number; skillDepth: number; rarity: number; marketDemand: number; identityAlignment: number; }
export const talentStackScore = (f: TalentStackFactors) =>
  geo(f.skillDiversity, f.skillDepth, f.rarity, f.marketDemand, f.identityAlignment);

export interface LeverageFactors { scalability: number; ownership: number; automation: number; distribution: number; compounding: number; }
export const leverageScore = (f: LeverageFactors) =>
  geo(f.scalability, f.ownership, f.automation, f.distribution, f.compounding);

export interface JudgmentFactors { predictionAccuracy: number; assumptionQuality: number; modelUsage: number; emotionalDiscipline: number; learningRate: number; }
export const judgmentScore = (f: JudgmentFactors) =>
  geo(f.predictionAccuracy, f.assumptionQuality, f.modelUsage, f.emotionalDiscipline, f.learningRate);

export interface WealthFactors { ownershipRatio: number; assetQuality: number; leverage: number; compounding: number; durability: number; }
export const wealthCreationScore = (f: WealthFactors) =>
  geo(f.ownershipRatio, f.assetQuality, f.leverage, f.compounding, f.durability);

export interface AssetFactors { ownership: number; leverage: number; compounding: number; durability: number; }
export const assetScore = (f: AssetFactors) => geo(f.ownership, f.leverage, f.compounding, f.durability);

export interface LongTermGameFactors { compounding: number; identityAlignment: number; relationshipQuality: number; reputationUpside: number; learningRate: number; shortTermTrapRisk: number; }
export const longTermGameScore = (f: LongTermGameFactors) => {
  // ÷ short-term trap risk → divide the geometric base by (1 + risk)
  const base = geo(f.compounding, f.identityAlignment, f.relationshipQuality, f.reputationUpside, f.learningRate);
  return Math.round(base / (1 + clamp01(f.shortTermTrapRisk)));
};

export interface FreedomFactors { timeFreedom: number; locationFreedom: number; financialResilience: number; psychologicalFreedom: number; optionality: number; }
export const freedomScore = (f: FreedomFactors) =>
  geo(f.timeFreedom, f.locationFreedom, f.financialResilience, f.psychologicalFreedom, f.optionality);

export interface HappinessFactors { peace: number; health: number; relationships: number; autonomy: number; gratitude: number; desireLoad: number; }
export const happinessScore = (f: HappinessFactors) => {
  // ÷ desire load
  const base = geo(f.peace, f.health, f.relationships, f.autonomy, f.gratitude);
  return Math.round(base / (1 + clamp01(f.desireLoad)));
};

export interface LifePortfolioFactors { health: number; wealth: number; relationships: number; mission: number; freedom: number; happiness: number; learning: number; }
export const lifePortfolioScore = (f: LifePortfolioFactors) =>
  geo(f.health, f.wealth, f.relationships, f.mission, f.freedom, f.happiness, f.learning);

export interface GlobalNavalFactors {
  specificKnowledge: number; judgment: number; leverage: number; wealthCreation: number;
  freedom: number; happiness: number; lifePortfolio: number; // each 0..100
}
/** GlobalNavalScore = geometric mean of the seven 0..100 sub-scores → 0..100. */
export const globalNavalScore = (f: GlobalNavalFactors) =>
  geo(f.specificKnowledge / 100, f.judgment / 100, f.leverage / 100, f.wealthCreation / 100, f.freedom / 100, f.happiness / 100, f.lifePortfolio / 100);

export interface NavalSnapshot extends GlobalNavalFactors { globalScore: number; talentStack: number; longTermGame: number; }
/** Assemble a snapshot row from the component scores. */
export function buildSnapshot(s: Omit<NavalSnapshot, "globalScore">): NavalSnapshot {
  return { ...s, globalScore: globalNavalScore(s) };
}
