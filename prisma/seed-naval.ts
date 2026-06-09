// MISSION OS — Naval Life OS seed. Creates a coherent life-strategy slice for the
// demo user so /naval and the dashboard render meaningful content out of the box.
import { PrismaClient } from "@prisma/client";
import * as S from "../src/lib/naval/scoring";

const prisma = new PrismaClient();
const userId = process.env.DEV_USER_ID || "usr_demo";

async function main() {
  // ensure the demo user exists (seed.ts normally creates it)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email: `${userId}@mission.local`, name: "Demo User", passwordHash: "seed" },
  });

  // clear prior naval data for a clean reseed
  await prisma.navalTwinInsight.deleteMany({ where: { userId } });
  await prisma.navalDigitalTwinProfile.deleteMany({ where: { userId } });
  await prisma.navalScoreSnapshot.deleteMany({ where: { userId } });
  await prisma.specificKnowledgeProfile.deleteMany({ where: { userId } });
  await prisma.talentStack.deleteMany({ where: { userId } });
  await prisma.leverageProfile.deleteMany({ where: { userId } });
  await prisma.navalJudgmentProfile.deleteMany({ where: { userId } });
  await prisma.decisionJournalEntry.deleteMany({ where: { userId } });
  await prisma.wealthProfile.deleteMany({ where: { userId } });
  await prisma.assetBuildPlan.deleteMany({ where: { userId } });
  await prisma.startupOpportunity.deleteMany({ where: { userId } });
  await prisma.longTermGame.deleteMany({ where: { userId } });
  await prisma.freedomProfile.deleteMany({ where: { userId } });
  await prisma.happinessProfile.deleteMany({ where: { userId } });
  await prisma.lifePortfolio.deleteMany({ where: { userId } });

  // 1 · Specific Knowledge
  const skF = { curiosityDepth: 0.8, skillRarity: 0.7, marketRelevance: 0.7, personalEnergy: 0.8, compounding: 0.7 };
  await prisma.specificKnowledgeProfile.create({
    data: {
      userId, summary: "Rare stack: AI engineering × pedagogy × systems thinking.", ...skF,
      score: S.specificKnowledgeScore(skF), source: "seed",
      metadata: { rareCombination: ["AI", "Teaching", "Systems design"], growthPlan: ["Publish one teardown a week", "Build one teaching artifact a month"] },
      assets: { create: [
        { userId, name: "AI-for-educators course", description: "Sits exactly on your intersection.", rarity: 0.7, relevance: 0.7 },
        { userId, name: "Systems-design newsletter", description: "Compounds reputation + distribution.", rarity: 0.6, relevance: 0.7 },
      ] },
    },
  });

  // 2 · Talent Stack
  const tsF = { skillDiversity: 0.8, skillDepth: 0.6, rarity: 0.7, marketDemand: 0.7, identityAlignment: 0.7 };
  await prisma.talentStack.create({
    data: {
      userId, name: "The AI engineer who can teach and design systems", combination: ["AI", "Teaching", "Systems design", "Writing"],
      identityStack: "The AI engineer who can teach and design systems", rarityScore: 0.7, defensibility: 0.7, optionality: 0.7,
      score: S.talentStackScore(tsF), metadata: { monetizationPaths: ["Cohort course", "Paid newsletter"] },
      signals: { create: ["AI", "Teaching", "Systems design", "Writing"].map((skill) => ({ userId, skill, depth: 0.6, demand: 0.7 })) },
    },
  });

  // 3 · Leverage
  const levF = { scalability: 0.4, ownership: 0.3, automation: 0.3, distribution: 0.4, compounding: 0.4 };
  await prisma.leverageProfile.create({
    data: {
      userId, summary: "Most income still rents your time; code & media leverage are underused.", timeForMoney: 0.7,
      score: S.leverageScore(levF), metadata: { upgradePlan: ["Productize one engagement into a template", "Publish to build media leverage"] },
      sources: { create: [
        { userId, category: "LABOR", usage: 0.7, scalability: 0.2, ownership: 0.2, compounding: 0.2 },
        { userId, category: "CODE", usage: 0.3, scalability: 0.8, ownership: 0.8, compounding: 0.7 },
        { userId, category: "MEDIA", usage: 0.2, scalability: 0.9, ownership: 0.8, compounding: 0.8 },
      ] },
    },
  });

  // 4 · Judgment
  const judF = { predictionAccuracy: 0.6, assumptionQuality: 0.5, modelUsage: 0.6, emotionalDiscipline: 0.6, learningRate: 0.6 };
  await prisma.navalJudgmentProfile.create({
    data: { userId, ...judF, blindSpots: ["Unstated assumptions", "No feedback loop on past calls"], score: S.judgmentScore(judF),
      metadata: { strengths: ["Decisiveness"], growthPlan: ["Log assumptions for every big decision", "Schedule review dates"] } },
  });

  // 5 · Decision Journal
  const e1 = await prisma.decisionJournalEntry.create({
    data: {
      userId, title: "Leave my job to build a product", context: "6 months runway, idea has early pull.",
      options: ["Stay", "Leave now", "Build nights/weekends first"], assumptions: ["6mo runway", "Idea has pull"],
      expectedOutcome: "A validated MVP in 90 days.", downsideRisk: "Burn savings with no traction.",
      upsidePotential: "Owned asset with compounding upside.", timeHorizon: "6 months", confidence: 0.55,
      modelsUsed: ["Expected value", "Reversibility"], rationale: "Reversible enough; the learning compounds.",
      reviewDate: new Date(Date.now() + 90 * 86400_000), status: "REVIEW",
    },
  });
  await prisma.decisionJournalReview.create({
    data: { userId, entryId: e1.id, actualOutcome: "Shipped MVP in 75 days; 4 paying beta users.", lessons: ["Pre-selling validated demand earlier than expected"], biasDetected: "Slight optimism bias on timeline", expectedVsActual: 0.4 },
  });
  await prisma.decisionJournalEntry.create({
    data: { userId, title: "Hire a contractor vs. learn design myself", options: ["Hire", "Learn", "Template"], assumptions: ["Design isn't my edge"], expectedOutcome: "Faster, better launch page.", confidence: 0.6, modelsUsed: ["Opportunity cost"], rationale: "Buy back time on non-edge work." },
  });

  // 6 · Wealth
  const wF = { ownershipRatio: 0.25, assetQuality: 0.4, leverage: 0.4, compounding: 0.5, durability: 0.5 };
  await prisma.wealthProfile.create({
    data: {
      userId, summary: "Mostly active income; the bottleneck is ownership, not ability.", ownershipRatio: 0.25, assetQuality: 0.4,
      durability: 0.5, bottleneck: "75% active income, few owned assets.", score: S.wealthCreationScore(wF),
      metadata: { roadmap: ["Ship one code asset", "Convert expertise into a sellable artifact"] },
      incomeStreams: { create: [ { userId, name: "Salary", kind: "ACTIVE", monthly: 0 }, { userId, name: "Course sales", kind: "LEVERAGED", monthly: 0 } ] },
      assets: { create: [ { userId, name: "Course", category: "KNOWLEDGE", ownership: 1, leverage: 0.7, compounding: 0.6, durability: 0.6 } ] },
    },
  });

  // 7 · Asset build plan
  await prisma.assetBuildPlan.create({
    data: { userId, assetName: "Migration playbook", category: "KNOWLEDGE", buildSteps: ["Outline the 10-step migration", "Write once, sell many"], distribution: ["Teardowns", "SEO"], maintenance: "Update once per major release.", compounding: 0.7, qualityScore: S.assetScore({ ownership: 1, leverage: 0.6, compounding: 0.7, durability: 0.6 }) },
  });

  // 8 · Opportunity
  await prisma.startupOpportunity.create({
    data: { userId, title: "Inbox-triage AI agent", opportunityType: "permissionless", problem: "Founders drown in email", mvp: "One-flow agent that drafts replies for 20 beta users.", distribution: ["Build-in-public", "Founder communities"], fitScore: 0.6, status: "IN_PROGRESS",
      metadata: { launchChecklist: ["Landing page", "Waitlist", "Beta cohort"] },
      experiments: { create: [{ userId, hypothesis: "Founders will pay $20/mo", test: "Pre-sell to 20 leads", metric: ">=5 paid pre-orders" }] } },
  });

  // 9 · Long-term games
  const g1 = { compounding: 0.8, identityAlignment: 0.8, relationshipQuality: 0.7, reputationUpside: 0.8, learningRate: 0.8, shortTermTrapRisk: 0.1 };
  const g2 = { compounding: 0.3, identityAlignment: 0.3, relationshipQuality: 0.3, reputationUpside: 0.2, learningRate: 0.3, shortTermTrapRisk: 0.8 };
  await prisma.longTermGame.create({ data: { userId, name: "Teach AI engineering in public for a decade", ...g1, score: S.longTermGameScore(g1), status: "ACTIVE", metadata: { recommendation: "keep" } } });
  await prisma.longTermGame.create({ data: { userId, name: "Chase viral hot-takes for reach", ...g2, score: S.longTermGameScore(g2), status: "ARCHIVED", metadata: { recommendation: "drop", shortTermTrap: "Virality optimizes attention, not trust." } } });

  // 10 · Freedom
  const fF = { timeFreedom: 0.4, locationFreedom: 0.3, financialResilience: 0.4, psychologicalFreedom: 0.6, optionality: 0.4 };
  await prisma.freedomProfile.create({
    data: { userId, ...fF, score: S.freedomScore(fF), metadata: { roadmap: ["Negotiate remote days", "Build a second, location-free income"] },
      constraints: { create: [ { userId, dimension: "TIME", description: "Fixed 9-6 with commute", severity: 0.7 }, { userId, dimension: "FINANCIAL", description: "Single income source", severity: 0.6 } ] } },
  });

  // 11 · Happiness
  const hF = { peace: 0.6, health: 0.6, relationships: 0.6, autonomy: 0.6, gratitude: 0.6, desireLoad: 0.4 };
  await prisma.happinessProfile.create({
    data: { userId, ...hF, score: S.happinessScore(hF), metadata: { desireAudit: ["Status desire is externally anchored → high suffering, low control"], practices: ["Daily gratitude note", "One comparison-free hour offline"] },
      reflections: { create: [{ userId, prompt: "check-in", entry: "Calmer this week after cutting comparison time.", practice: "gratitude reflection" }] } },
  });

  // 12 · Life portfolio
  const areas = [ ["HEALTH", 0.5], ["WEALTH", 0.6], ["LEARNING", 0.8], ["RELATIONSHIPS", 0.5], ["MISSION", 0.7], ["FREEDOM", 0.4], ["HAPPINESS", 0.6], ["CREATIVITY", 0.6], ["LEGACY", 0.5] ] as const;
  const lpF = { health: 0.5, wealth: 0.6, relationships: 0.5, mission: 0.7, freedom: 0.4, happiness: 0.6, learning: 0.8 };
  await prisma.lifePortfolio.create({
    data: { userId, imbalance: "Learning & mission strong; freedom and relationships lag.", score: S.lifePortfolioScore(lpF),
      metadata: { reallocation: [{ area: "FREEDOM", action: "Build location-free income" }, { area: "RELATIONSHIPS", action: "One undistracted evening/week" }], quarterlyReview: ["Re-rate each area", "Rebalance to the two lowest"] },
      areas: { create: areas.map(([area, current]) => ({ userId, area: area as never, current, target: Math.min(1, current + 0.2) })) } },
  });

  // 13 · Digital twin
  const twin = await prisma.navalDigitalTwinProfile.create({
    data: { userId, summary: "Strong knowledge, weak leverage — the gap is ownership, not ability.", driftScore: 0.4, strategy: { goal: "Financial freedom in 5y" } },
  });
  await prisma.navalTwinInsight.createMany({ data: [
    { userId, twinId: twin.id, insight: "Productize the top skill into one media + one code asset", kind: "opportunity", priority: 5 },
    { userId, twinId: twin.id, insight: "Knowledge growing but not being converted into assets.", kind: "drift", priority: 4 },
    { userId, twinId: twin.id, insight: "Time: still trading hours for money", kind: "constraint", priority: 3 },
  ] });

  // snapshots (trend)
  const snap = (specificKnowledge: number, leverage: number, wealthCreation: number, freedom: number) => {
    const judgment = S.judgmentScore(judF), happiness = S.happinessScore(hF), lifePortfolio = S.lifePortfolioScore(lpF), talentStack = S.talentStackScore(tsF), longTermGame = S.longTermGameScore(g1);
    const globalScore = S.globalNavalScore({ specificKnowledge, judgment, leverage, wealthCreation, freedom, happiness, lifePortfolio });
    return { userId, globalScore, specificKnowledge, talentStack, leverage, judgment, wealthCreation, longTermGame, freedom, happiness, lifePortfolio };
  };
  await prisma.navalScoreSnapshot.create({ data: snap(45, 25, 30, 30) });
  await prisma.navalScoreSnapshot.create({ data: snap(S.specificKnowledgeScore(skF), S.leverageScore(levF), S.wealthCreationScore(wF), S.freedomScore(fF)) });

  console.log("Naval Life OS seed complete for", userId);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
