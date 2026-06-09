/* Naval Life OS — read/compute service. Reads the latest per-engine state,
   assembles the scoreboard + global score, writes snapshots, and generates the
   90-day plan. Sub-scores are 0..100. Routes call these; no AI calls here. */
import { prisma } from "../db";
import * as S from "./scoring";

const latest = { orderBy: { createdAt: "desc" as const } };

export interface NavalDashboard {
  scores: {
    global: number; specificKnowledge: number; talentStack: number; leverage: number;
    judgment: number; wealthCreation: number; longTermGame: number; freedom: number;
    happiness: number; lifePortfolio: number;
  };
  counts: { assets: number; decisions: number; opportunities: number; games: number; knowledgeAssets: number };
  longTermGames: { id: string; name: string; score: number | null }[];
  recommendedNextAction: string;
  hasData: boolean;
}

export async function computeNavalDashboard(userId: string): Promise<NavalDashboard> {
  const [sk, ts, lev, jud, wealth, games, freedom, happiness, portfolio,
    wealthAssets, assetPlans, decisions, opportunities, knowledgeAssets] = await Promise.all([
    prisma.specificKnowledgeProfile.findFirst({ where: { userId }, ...latest }),
    prisma.talentStack.findFirst({ where: { userId }, ...latest }),
    prisma.leverageProfile.findFirst({ where: { userId }, ...latest }),
    prisma.navalJudgmentProfile.findFirst({ where: { userId }, ...latest }),
    prisma.wealthProfile.findFirst({ where: { userId }, ...latest }),
    prisma.longTermGame.findMany({ where: { userId, status: "ACTIVE" }, orderBy: { score: "desc" }, take: 5 }),
    prisma.freedomProfile.findFirst({ where: { userId }, ...latest }),
    prisma.happinessProfile.findFirst({ where: { userId }, ...latest }),
    prisma.lifePortfolio.findFirst({ where: { userId }, ...latest }),
    prisma.wealthAsset.count({ where: { userId } }),
    prisma.assetBuildPlan.count({ where: { userId } }),
    prisma.decisionJournalEntry.count({ where: { userId } }),
    prisma.startupOpportunity.count({ where: { userId } }),
    prisma.specificKnowledgeAsset.count({ where: { userId } }),
  ]);

  const scores = {
    specificKnowledge: sk?.score ?? 0,
    talentStack: ts?.score ?? 0,
    leverage: lev?.score ?? 0,
    judgment: jud?.score ?? 0,
    wealthCreation: wealth?.score ?? 0,
    longTermGame: games[0]?.score ?? 0,
    freedom: freedom?.score ?? 0,
    happiness: happiness?.score ?? 0,
    lifePortfolio: portfolio?.score ?? 0,
  };
  const global = S.globalNavalScore(scores);

  // recommended next action = lowest of the seven global drivers
  const drivers: [string, number, string][] = [
    ["specificKnowledge", scores.specificKnowledge, "Run the Specific Knowledge assessment to find what you uniquely know."],
    ["leverage", scores.leverage, "You're likely renting your time — build one code/media/AI asset to add leverage."],
    ["judgment", scores.judgment, "Start a decision journal; reviewing predictions is the fastest way to improve judgment."],
    ["wealthCreation", scores.wealthCreation, "Shift from salary to ownership — map your income streams and pick one asset to own."],
    ["freedom", scores.freedom, "Map your binding constraints and design a freedom roadmap (time, location, financial, psychological)."],
    ["happiness", scores.happiness, "Run a desire audit — lowering desire load raises happiness faster than adding wins."],
    ["lifePortfolio", scores.lifePortfolio, "Rebalance your life portfolio toward the two most-neglected areas."],
  ];
  const hasData = Object.values(scores).some((v) => v > 0);
  const lowest = drivers.reduce((a, b) => (b[1] < a[1] ? b : a));
  const recommendedNextAction = hasData
    ? lowest[2]
    : "Begin onboarding: complete the Specific Knowledge assessment to seed your Naval Life OS.";

  return {
    scores: { global, ...scores },
    counts: { assets: wealthAssets + assetPlans, decisions, opportunities, games: games.length, knowledgeAssets },
    longTermGames: games.map((g) => ({ id: g.id, name: g.name, score: g.score })),
    recommendedNextAction,
    hasData,
  };
}

export async function recordSnapshot(userId: string) {
  const d = await computeNavalDashboard(userId);
  return prisma.navalScoreSnapshot.create({
    data: {
      userId, globalScore: d.scores.global, specificKnowledge: d.scores.specificKnowledge,
      talentStack: d.scores.talentStack, leverage: d.scores.leverage, judgment: d.scores.judgment,
      wealthCreation: d.scores.wealthCreation, longTermGame: d.scores.longTermGame, freedom: d.scores.freedom,
      happiness: d.scores.happiness, lifePortfolio: d.scores.lifePortfolio,
    },
  });
}

export async function snapshotTrend(userId: string, take = 30) {
  const rows = await prisma.navalScoreSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take });
  return rows.map((r) => ({ at: r.createdAt, global: r.globalScore }));
}

/* ── 90-day plan (Section 26) ──────────────────────────────────────────────── */
export interface NavalPlanTask { task: string; engine: string }
export interface NavalPlanMonth { month: 1 | 2 | 3; theme: string; focus: string; tasks: NavalPlanTask[] }
export interface NavalPlan { generatedAt: string; headline: string; months: NavalPlanMonth[]; northStar: string }

const meta = <T,>(m: unknown, key: string, fallback: T): T => {
  const v = (m && typeof m === "object" ? (m as Record<string, unknown>)[key] : undefined);
  return (v ?? fallback) as T;
};

export async function generate90DayPlan(userId: string): Promise<NavalPlan> {
  const [sk, lev, wealth, game, asset, freedom] = await Promise.all([
    prisma.specificKnowledgeProfile.findFirst({ where: { userId }, ...latest }),
    prisma.leverageProfile.findFirst({ where: { userId }, ...latest }),
    prisma.wealthProfile.findFirst({ where: { userId }, ...latest }),
    prisma.longTermGame.findFirst({ where: { userId, status: "ACTIVE" }, orderBy: { score: "desc" } }),
    prisma.assetBuildPlan.findFirst({ where: { userId }, ...latest }),
    prisma.freedomProfile.findFirst({ where: { userId }, ...latest }),
  ]);

  const growthPlan = meta<string[]>(sk?.metadata, "growthPlan", []);
  const upgradePlan = meta<string[]>(lev?.metadata, "upgradePlan", []);
  const wealthRoadmap = meta<string[]>(wealth?.metadata, "roadmap", []);
  const freedomRoadmap = meta<string[]>(freedom?.metadata, "roadmap", []);
  const assetName = asset?.assetName ?? "your first leverage asset";
  const gameName = game?.name ?? "a long-term game worth a decade";

  const months: NavalPlanMonth[] = [
    {
      month: 1, theme: "Discover", focus: "Specific knowledge & clarity",
      tasks: [
        { task: growthPlan[0] ?? "Complete the Specific Knowledge assessment and name your rare combination.", engine: "specific-knowledge" },
        { task: "Clarify your talent stack — the 3-4 skills that make you hard to replace.", engine: "talent-stack" },
        { task: "Start a decision journal; log every meaningful decision with its assumptions.", engine: "decision-journal" },
      ],
    },
    {
      month: 2, theme: "Build", focus: "Leverage & long-term game",
      tasks: [
        { task: upgradePlan[0] ?? `Build ${assetName} as your first owned, compounding asset.`, engine: "leverage" },
        { task: `Choose your long-term game: commit to ${gameName}.`, engine: "long-term-games" },
        { task: "Audit and reduce low-leverage, time-for-money commitments.", engine: "leverage" },
      ],
    },
    {
      month: 3, theme: "Launch", focus: "Permissionless project & review",
      tasks: [
        { task: wealthRoadmap[0] ?? "Launch a permissionless project — ship the MVP and run one validation experiment.", engine: "opportunities" },
        { task: "Review the first month of decisions: compare expected vs. actual, extract lessons.", engine: "decision-journal" },
        { task: freedomRoadmap[0] ?? "Update your freedom roadmap and re-snapshot your global Naval score.", engine: "freedom" },
      ],
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    headline: "A 90-day plan to compound specific knowledge into leverage, ownership and freedom.",
    months,
    northStar: "Own equity in something. Apply leverage. Play long-term games with long-term people.",
  };
}
