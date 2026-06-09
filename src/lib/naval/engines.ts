/* Naval Life OS — engine operations. Each function runs the matching AI agent,
   persists the result via Prisma, and returns the saved rows. Routes stay thin:
   they validate input and call one of these. Scores are 0..100 (see scoring.ts). */
import { prisma } from "../db";
import {
  SpecificKnowledgeCoach, TalentStackArchitect, LeverageCoach, NavalJudgmentCoach,
  DecisionJournalCoach, WealthArchitect, AssetBuilderCoach, PermissionlessStartupCoach,
  LongTermGameAdvisor, FreedomArchitect, HappinessCoach, LifePortfolioAdvisor,
  NavalDigitalTwinSimulator,
} from "../agents/naval";
import * as S from "./scoring";

/* ── enum coercion helpers (agents return lowercase / free text) ───────────── */
const LEVERAGE = ["LABOR", "CAPITAL", "CODE", "MEDIA", "AI_AGENT", "COMMUNITY", "BRAND", "NETWORK", "KNOWLEDGE", "SYSTEM"] as const;
const ASSET = ["CODE", "MEDIA", "KNOWLEDGE", "PRODUCT", "BRAND", "COMMUNITY", "EQUITY", "INVESTMENT", "BUSINESS", "AI_AGENT"] as const;
const AREA = ["HEALTH", "WEALTH", "LEARNING", "RELATIONSHIPS", "MISSION", "FREEDOM", "HAPPINESS", "CREATIVITY", "LEGACY"] as const;
const FREEDOM_DIM = ["TIME", "LOCATION", "FINANCIAL", "PSYCHOLOGICAL"] as const;
const INCOME = ["ACTIVE", "PASSIVE", "LEVERAGED"] as const;

type Lev = (typeof LEVERAGE)[number];
type Ast = (typeof ASSET)[number];
type Ar = (typeof AREA)[number];
type Fd = (typeof FREEDOM_DIM)[number];
type Inc = (typeof INCOME)[number];

const norm = (s: string) => s.trim().toUpperCase().replace(/[\s-]+/g, "_");
const coerce = <T extends string>(opts: readonly T[], v: string, fallback: T): T => {
  const n = norm(v);
  return (opts.find((o) => o === n) ?? opts.find((o) => n.includes(o) || o.includes(n)) ?? fallback) as T;
};
const levCat = (v: string) => coerce<Lev>(LEVERAGE, v, "KNOWLEDGE");
const astCat = (v: string) => coerce<Ast>(ASSET, v, "KNOWLEDGE");
const areaCat = (v: string) => coerce<Ar>(AREA, v, "MISSION");
const freedomDim = (v: string) => coerce<Fd>(FREEDOM_DIM, v, "PSYCHOLOGICAL");
const incomeKind = (v: string) => coerce<Inc>(INCOME, v, "ACTIVE");

/* ── 1 · Specific Knowledge ────────────────────────────────────────────────── */
export async function assessSpecificKnowledge(userId: string, input: { answers: string[]; context?: string }) {
  const out = await SpecificKnowledgeCoach.run({ answers: input.answers, context: input.context ?? "" });
  const c = out.components;
  const score = S.specificKnowledgeScore(c);
  const profile = await prisma.specificKnowledgeProfile.create({
    data: {
      userId, summary: out.summary, curiosityDepth: c.curiosityDepth, skillRarity: c.skillRarity,
      marketRelevance: c.marketRelevance, personalEnergy: c.personalEnergy, compounding: c.compounding,
      score, source: "SpecificKnowledgeCoach",
      metadata: { rareCombination: out.rareCombination, growthPlan: out.growthPlan },
      assets: { create: out.knowledgeAssets.map((a) => ({ userId, name: a.name, description: a.why, rarity: c.skillRarity, relevance: c.marketRelevance })) },
    },
    include: { assets: true },
  });
  return { profile, score, growthPlan: out.growthPlan, rareCombination: out.rareCombination };
}

export async function addSpecificKnowledgeAsset(userId: string, input: { name: string; description?: string; evidence?: string[]; profileId?: string; rarity?: number; relevance?: number }) {
  return prisma.specificKnowledgeAsset.create({
    data: {
      userId, name: input.name, description: input.description ?? "", evidence: input.evidence ?? [],
      profileId: input.profileId, rarity: input.rarity ?? 0, relevance: input.relevance ?? 0,
      score: S.assetScore({ ownership: 1, leverage: input.relevance ?? 0.5, compounding: input.rarity ?? 0.5, durability: 0.6 }),
    },
  });
}

/* ── 2 · Talent Stack ──────────────────────────────────────────────────────── */
export async function buildTalentStack(userId: string, input: { skills: string[]; interests?: string[] }) {
  const out = await TalentStackArchitect.run({ skills: input.skills, interests: input.interests ?? [] });
  const c = out.components;
  const score = S.talentStackScore(c);
  const stack = await prisma.talentStack.create({
    data: {
      userId, name: out.identityStack || "Talent stack", combination: out.stack, identityStack: out.identityStack,
      rarityScore: c.rarity, defensibility: c.identityAlignment, optionality: c.marketDemand, score,
      metadata: { monetizationPaths: out.monetizationPaths, defensibility: out.defensibility },
      signals: { create: out.stack.map((skill) => ({ userId, skill, depth: c.skillDepth, demand: c.marketDemand })) },
    },
    include: { signals: true },
  });
  return { stack, score, monetizationPaths: out.monetizationPaths };
}

/* ── 3 · Leverage ──────────────────────────────────────────────────────────── */
export async function assessLeverage(userId: string, input: { currentWork: string; incomeSources?: string[] }) {
  const out = await LeverageCoach.run({ currentWork: input.currentWork, incomeSources: input.incomeSources ?? [] });
  const c = out.components;
  const score = S.leverageScore(c);
  const profile = await prisma.leverageProfile.create({
    data: {
      userId, summary: out.lowLeverageWarning, timeForMoney: out.timeForMoney, score,
      metadata: { upgradePlan: out.upgradePlan, components: c },
      sources: {
        create: out.distribution.map((d) => ({
          userId, category: levCat(d.category), usage: d.usage,
          scalability: c.scalability, ownership: c.ownership, compounding: c.compounding,
        })),
      },
    },
    include: { sources: true },
  });
  return { profile, score, upgradePlan: out.upgradePlan, timeForMoney: out.timeForMoney };
}

/* ── 4 · Judgment ──────────────────────────────────────────────────────────── */
export async function assessJudgment(userId: string, input: { decisions?: string[]; reflections?: string[] }) {
  const out = await NavalJudgmentCoach.run({ decisions: input.decisions ?? [], reflections: input.reflections ?? [] });
  const c = out.components;
  const score = S.judgmentScore(c);
  const profile = await prisma.navalJudgmentProfile.create({
    data: {
      userId, predictionAccuracy: c.predictionAccuracy, assumptionQuality: c.assumptionQuality,
      modelUsage: c.modelUsage, emotionalDiscipline: c.emotionalDiscipline, learningRate: c.learningRate,
      blindSpots: out.blindSpots, score, metadata: { strengths: out.strengths, growthPlan: out.growthPlan },
    },
  });
  return { profile, score, strengths: out.strengths, blindSpots: out.blindSpots, growthPlan: out.growthPlan };
}

/* ── 5 · Decision Journal ──────────────────────────────────────────────────── */
export async function createDecisionEntry(userId: string, input: { decision: string; context?: string }) {
  const out = await DecisionJournalCoach.run({ decision: input.decision, context: input.context ?? "" });
  const reviewDate = new Date(Date.now() + out.reviewInDays * 86400_000);
  const entry = await prisma.decisionJournalEntry.create({
    data: {
      userId, title: input.decision.slice(0, 140), context: input.context ?? "",
      options: out.options, assumptions: out.assumptions, expectedOutcome: out.expectedOutcome,
      downsideRisk: out.downsideRisk, upsidePotential: out.upsidePotential, timeHorizon: out.timeHorizon,
      confidence: out.confidence, modelsUsed: out.modelsUsed, rationale: out.rationale, reviewDate,
      metadata: { reviewInDays: out.reviewInDays },
    },
  });
  return entry;
}

export async function reviewDecisionEntry(userId: string, input: { entryId: string; actualOutcome: string; lessons?: string[]; biasDetected?: string; expectedVsActual?: number }) {
  const entry = await prisma.decisionJournalEntry.findFirst({ where: { id: input.entryId, userId } });
  if (!entry) throw new Error("Decision entry not found");
  const review = await prisma.decisionJournalReview.create({
    data: {
      userId, entryId: entry.id, actualOutcome: input.actualOutcome, lessons: input.lessons ?? [],
      biasDetected: input.biasDetected ?? "", expectedVsActual: input.expectedVsActual ?? 0,
    },
  });
  await prisma.decisionJournalEntry.update({ where: { id: entry.id }, data: { status: "REVIEW" } });
  return review;
}

/* ── 6 · Wealth ────────────────────────────────────────────────────────────── */
export async function assessWealth(userId: string, input: { incomeStreams?: string[]; assets?: string[] }) {
  const out = await WealthArchitect.run({ incomeStreams: input.incomeStreams ?? [], assets: input.assets ?? [] });
  const c = out.components;
  const score = S.wealthCreationScore(c);
  const profile = await prisma.wealthProfile.create({
    data: {
      userId, summary: out.bottleneck, ownershipRatio: c.ownershipRatio, assetQuality: c.assetQuality,
      durability: c.durability, bottleneck: out.bottleneck, score, metadata: { roadmap: out.roadmap, components: c },
      incomeStreams: { create: out.incomeMap.map((m) => ({ userId, name: m.name, kind: incomeKind(m.kind) })) },
      assets: { create: (input.assets ?? []).map((name) => ({ userId, name, category: astCat(name), ownership: c.ownershipRatio, leverage: c.leverage, compounding: c.compounding, durability: c.durability })) },
    },
    include: { incomeStreams: true, assets: true },
  });
  return { profile, score, roadmap: out.roadmap, bottleneck: out.bottleneck };
}

/* ── 7 · Assets ────────────────────────────────────────────────────────────── */
export async function generateAssetIdeas(userId: string, input: { knowledge: string; audience?: string }) {
  const out = await AssetBuilderCoach.run({ knowledge: input.knowledge, audience: input.audience ?? "" });
  const plans = await prisma.$transaction(out.ideas.map((idea) =>
    prisma.assetBuildPlan.create({
      data: {
        userId, assetName: idea.idea, category: astCat(idea.category), compounding: idea.compounding,
        buildSteps: out.buildPlan, distribution: out.distributionPlan, maintenance: out.maintenance,
        qualityScore: S.assetScore({ ownership: 1, leverage: 0.6, compounding: idea.compounding, durability: 0.6 }),
        metadata: { recommended: out.recommended === idea.idea },
      },
    })));
  return { plans, recommended: out.recommended };
}

export async function scoreAsset(input: { ownership: number; leverage: number; compounding: number; durability: number }) {
  return S.assetScore(input);
}

/* ── 8 · Permissionless Entrepreneurship ───────────────────────────────────── */
export async function discoverOpportunity(userId: string, input: { skills?: string[]; interests?: string[] }) {
  const out = await PermissionlessStartupCoach.run({ skills: input.skills ?? [], interests: input.interests ?? [] });
  const top = out.opportunities[0];
  const opp = await prisma.startupOpportunity.create({
    data: {
      userId, title: top?.title ?? "Opportunity", opportunityType: "permissionless",
      problem: top?.problem ?? "", mvp: out.mvp, distribution: out.distribution,
      fitScore: top?.fit ?? 0, metadata: { launchChecklist: out.launchChecklist, allOpportunities: out.opportunities },
      experiments: { create: [{ userId, hypothesis: out.validationExperiment.hypothesis, test: out.validationExperiment.test, metric: out.validationExperiment.metric }] },
    },
    include: { experiments: true },
  });
  return { opportunity: opp, opportunities: out.opportunities, mvp: out.mvp, launchChecklist: out.launchChecklist };
}

export async function addValidationExperiment(userId: string, input: { opportunityId?: string; hypothesis: string; test?: string; metric?: string }) {
  return prisma.validationExperiment.create({
    data: { userId, opportunityId: input.opportunityId, hypothesis: input.hypothesis, test: input.test ?? "", metric: input.metric ?? "" },
  });
}

/* ── 9 · Long-Term Games ───────────────────────────────────────────────────── */
export async function assessLongTermGame(userId: string, input: { game: string; context?: string }) {
  const out = await LongTermGameAdvisor.run({ game: input.game, context: input.context ?? "" });
  const c = out.components;
  const score = S.longTermGameScore(c);
  const game = await prisma.longTermGame.create({
    data: {
      userId, name: input.game, compounding: c.compounding, identityAlignment: c.identityAlignment,
      relationshipQuality: c.relationshipQuality, reputationUpside: c.reputationUpside, learningRate: c.learningRate,
      shortTermTrapRisk: c.shortTermTrapRisk, score,
      status: out.recommendation === "drop" ? "ARCHIVED" : "ACTIVE",
      metadata: { shortTermTrap: out.shortTermTrap, recommendation: out.recommendation, reasoning: out.reasoning },
    },
  });
  return { game, score, recommendation: out.recommendation, shortTermTrap: out.shortTermTrap };
}

/* ── 10 · Freedom ──────────────────────────────────────────────────────────── */
export async function assessFreedom(userId: string, input: { situation: string; constraints?: string[] }) {
  const out = await FreedomArchitect.run({ situation: input.situation, constraints: input.constraints ?? [] });
  const c = out.components;
  const score = S.freedomScore(c);
  const profile = await prisma.freedomProfile.create({
    data: {
      userId, timeFreedom: c.timeFreedom, locationFreedom: c.locationFreedom, financialResilience: c.financialResilience,
      psychologicalFreedom: c.psychologicalFreedom, optionality: c.optionality, score, metadata: { roadmap: out.roadmap },
      constraints: { create: out.constraints.map((k) => ({ userId, dimension: freedomDim(k.dimension), description: k.description, severity: k.severity })) },
    },
    include: { constraints: true },
  });
  return { profile, score, roadmap: out.roadmap };
}

/* ── 11 · Happiness ────────────────────────────────────────────────────────── */
export async function assessHappiness(userId: string, input: { checkIn: string; desires?: string[] }) {
  const out = await HappinessCoach.run({ checkIn: input.checkIn, desires: input.desires ?? [] });
  const c = out.components;
  const score = S.happinessScore(c);
  const profile = await prisma.happinessProfile.create({
    data: {
      userId, peace: c.peace, health: c.health, relationships: c.relationships, autonomy: c.autonomy,
      gratitude: c.gratitude, desireLoad: c.desireLoad, score,
      metadata: { desireAudit: out.desireAudit, practices: out.practices, note: out.note },
      reflections: { create: [{ userId, prompt: "check-in", entry: input.checkIn, practice: out.practices[0] ?? "" }] },
    },
    include: { reflections: true },
  });
  return { profile, score, practices: out.practices, desireAudit: out.desireAudit, note: out.note };
}

export async function addHappinessReflection(userId: string, input: { profileId?: string; prompt?: string; entry: string; practice?: string }) {
  return prisma.happinessReflection.create({
    data: { userId, profileId: input.profileId, prompt: input.prompt ?? "", entry: input.entry, practice: input.practice ?? "" },
  });
}

/* ── 12 · Life Portfolio ───────────────────────────────────────────────────── */
export async function assessLifePortfolio(userId: string, input: { areas: { area: string; current: number }[]; context?: string }) {
  const out = await LifePortfolioAdvisor.run({ areas: input.areas, context: input.context ?? "" });
  const get = (a: Ar) => input.areas.find((x) => areaCat(x.area) === a)?.current ?? 0.5;
  const score = S.lifePortfolioScore({
    health: get("HEALTH"), wealth: get("WEALTH"), relationships: get("RELATIONSHIPS"), mission: get("MISSION"),
    freedom: get("FREEDOM"), happiness: get("HAPPINESS"), learning: get("LEARNING"),
  });
  const portfolio = await prisma.lifePortfolio.create({
    data: {
      userId, imbalance: out.imbalance, score, metadata: { reallocation: out.reallocation, quarterlyReview: out.quarterlyReview },
      areas: { create: input.areas.map((a) => ({ userId, area: areaCat(a.area), current: a.current, target: Math.min(1, a.current + 0.2) })) },
    },
    include: { areas: true },
  });
  return { portfolio, score, imbalance: out.imbalance, reallocation: out.reallocation };
}

/* ── 13 · Digital Twin ─────────────────────────────────────────────────────── */
export async function synthesizeTwin(userId: string, input: { signals?: string[]; goal?: string }) {
  const out = await NavalDigitalTwinSimulator.run({ signals: input.signals ?? [], goal: input.goal ?? "" });
  const twin = await prisma.navalDigitalTwinProfile.upsert({
    where: { userId },
    update: { summary: out.summary, driftScore: out.driftScore, strategy: { goal: input.goal, constraints: out.constraints } },
    create: { userId, summary: out.summary, driftScore: out.driftScore, strategy: { goal: input.goal, constraints: out.constraints } },
  });
  // refresh insights
  await prisma.navalTwinInsight.createMany({
    data: [
      ...out.opportunities.map((o) => ({ userId, twinId: twin.id, insight: o.insight, kind: "opportunity", priority: o.priority })),
      { userId, twinId: twin.id, insight: out.driftWarning, kind: "drift", priority: 4 },
      ...out.constraints.map((c) => ({ userId, twinId: twin.id, insight: c, kind: "constraint", priority: 3 })),
    ],
  });
  const insights = await prisma.navalTwinInsight.findMany({ where: { twinId: twin.id }, orderBy: { priority: "desc" }, take: 20 });
  return { twin, insights, summary: out.summary, driftScore: out.driftScore, driftWarning: out.driftWarning };
}
