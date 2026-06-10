/* Naval Life OS v2 — goals, persisted 90-day plans, onboarding, due reviews, and
   automatic digital-twin signal collection. All NEW functions; routes call these.
   Kept separate from service.ts so the original module stays focused. */
import { prisma } from "../db";
import { generate90DayPlan, type NavalPlan as PlanShape } from "./service";

const latest = { orderBy: { createdAt: "desc" as const } };

/* ── Goals ─────────────────────────────────────────────────────────────────── */
const HORIZONS = ["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"] as const;
type Horizon = (typeof HORIZONS)[number];
const horizonOf = (v?: string): Horizon =>
  (HORIZONS.find((h) => h === (v ?? "").toUpperCase().replace(/[\s-]+/g, "_")) ?? "FIVE_YEARS");

export async function setGoal(userId: string, input: { statement: string; horizon?: string; why?: string; targetDate?: string }) {
  // a user keeps one ACTIVE north star — archive the rest
  await prisma.navalGoal.updateMany({ where: { userId, status: "ACTIVE" }, data: { status: "ARCHIVED" } });
  return prisma.navalGoal.create({
    data: {
      userId, statement: input.statement, horizon: horizonOf(input.horizon), why: input.why ?? "",
      targetDate: input.targetDate ? new Date(input.targetDate) : null, status: "ACTIVE",
    },
  });
}

export function getActiveGoal(userId: string) {
  return prisma.navalGoal.findFirst({ where: { userId, status: "ACTIVE" }, ...latest });
}

/* ── 90-day plan persistence ───────────────────────────────────────────────── */
const monthDue = (month: number) => new Date(Date.now() + month * 30 * 86400_000);

export async function saveCurrentPlan(userId: string) {
  const generated: PlanShape = await generate90DayPlan(userId);
  const goal = await getActiveGoal(userId);
  // archive previous active plans
  await prisma.navalPlan.updateMany({ where: { userId, status: "ACTIVE" }, data: { status: "ARCHIVED" } });

  let order = 0;
  const tasks = generated.months.flatMap((m) =>
    m.tasks.map((t) => ({ userId, month: m.month, engine: t.engine, task: t.task, dueDate: monthDue(m.month), order: order++ })));

  const plan = await prisma.navalPlan.create({
    data: {
      userId, goalId: goal?.id ?? null, headline: generated.headline, northStar: generated.northStar,
      status: "ACTIVE", progress: 0,
      metadata: { months: generated.months.map((m) => ({ month: m.month, theme: m.theme, focus: m.focus })) },
      tasks: { create: tasks },
    },
    include: { tasks: { orderBy: { order: "asc" } } },
  });
  return plan;
}

export function getActivePlan(userId: string) {
  return prisma.navalPlan.findFirst({
    where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } },
    orderBy: { createdAt: "desc" },
    include: { tasks: { orderBy: { order: "asc" } }, goal: true },
  });
}

export async function togglePlanTask(userId: string, taskId: string, done: boolean) {
  const task = await prisma.navalPlanTask.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error("Plan task not found");
  await prisma.navalPlanTask.update({ where: { id: task.id }, data: { done, doneAt: done ? new Date() : null } });
  const all = await prisma.navalPlanTask.findMany({ where: { planId: task.planId } });
  const doneCount = all.filter((t) => t.done).length;
  const progress = all.length ? doneCount / all.length : 0;
  const complete = progress >= 1;
  await prisma.navalPlan.update({
    where: { id: task.planId },
    data: { progress, status: complete ? "COMPLETED" : "ACTIVE", completedAt: complete ? new Date() : null },
  });
  return { planId: task.planId, progress, done: doneCount, total: all.length, completed: complete };
}

/* ── Onboarding (Section 25 — 11 steps) ────────────────────────────────────── */
export const ONBOARDING_STEPS: { step: number; title: string; href: string }[] = [
  { step: 1, title: "Discover your specific knowledge", href: "/naval/specific-knowledge" },
  { step: 2, title: "Map your talent stack", href: "/naval/talent-stack" },
  { step: 3, title: "Analyze your current leverage", href: "/naval/leverage" },
  { step: 4, title: "Map your income streams", href: "/naval/wealth" },
  { step: 5, title: "Build your wealth profile", href: "/naval/wealth" },
  { step: 6, title: "Design your freedom profile", href: "/naval/freedom" },
  { step: 7, title: "Train your happiness profile", href: "/naval/happiness" },
  { step: 8, title: "Balance your life portfolio", href: "/naval/life-portfolio" },
  { step: 9, title: "Choose one long-term game", href: "/naval/long-term-games" },
  { step: 10, title: "Pick one asset to build", href: "/naval/assets" },
  { step: 11, title: "Generate your 90-day plan", href: "/naval/plan" },
];
export const ONBOARDING_TOTAL = ONBOARDING_STEPS.length;

export async function getOnboarding(userId: string) {
  const row = await prisma.navalOnboarding.upsert({
    where: { userId }, update: {}, create: { userId, status: "NOT_STARTED", currentStep: 1, completedSteps: [] },
  });
  return { ...row, steps: ONBOARDING_STEPS, total: ONBOARDING_TOTAL };
}

export async function advanceOnboarding(userId: string, step: number) {
  const row = await prisma.navalOnboarding.upsert({
    where: { userId }, update: {}, create: { userId, status: "NOT_STARTED", currentStep: 1, completedSteps: [] },
  });
  const completed = Array.from(new Set([...row.completedSteps, step])).filter((s) => s >= 1 && s <= ONBOARDING_TOTAL).sort((a, b) => a - b);
  const isDone = completed.length >= ONBOARDING_TOTAL;
  const next = Math.min(ONBOARDING_TOTAL, (completed[completed.length - 1] ?? step) + 1);
  const updated = await prisma.navalOnboarding.update({
    where: { userId },
    data: {
      completedSteps: completed, currentStep: isDone ? ONBOARDING_TOTAL : next,
      status: isDone ? "COMPLETED" : "IN_PROGRESS",
      startedAt: row.startedAt ?? new Date(), completedAt: isDone ? new Date() : null,
    },
  });
  return { ...updated, steps: ONBOARDING_STEPS, total: ONBOARDING_TOTAL };
}

/* ── Due decision reviews ──────────────────────────────────────────────────── */
export async function dueDecisionReviews(userId: string) {
  const now = new Date();
  const entries = await prisma.decisionJournalEntry.findMany({
    where: { userId, reviewDate: { lte: now }, status: { not: "REVIEW" } },
    orderBy: { reviewDate: "asc" }, take: 25,
  });
  return entries.map((e) => ({ id: e.id, title: e.title, reviewDate: e.reviewDate, expectedOutcome: e.expectedOutcome, confidence: e.confidence }));
}

/* ── Digital-twin automatic signal collection ──────────────────────────────── */
const pct = (v?: number | null) => (v == null ? "n/a" : `${Math.round(v)}`);

export async function collectTwinSignals(userId: string): Promise<string[]> {
  const [sk, ts, lev, jud, wealth, game, freedom, happiness, portfolio] = await Promise.all([
    prisma.specificKnowledgeProfile.findFirst({ where: { userId }, ...latest }),
    prisma.talentStack.findFirst({ where: { userId }, ...latest }),
    prisma.leverageProfile.findFirst({ where: { userId }, ...latest }),
    prisma.navalJudgmentProfile.findFirst({ where: { userId }, ...latest }),
    prisma.wealthProfile.findFirst({ where: { userId }, ...latest }),
    prisma.longTermGame.findFirst({ where: { userId, status: "ACTIVE" }, orderBy: { score: "desc" } }),
    prisma.freedomProfile.findFirst({ where: { userId }, ...latest }),
    prisma.happinessProfile.findFirst({ where: { userId }, ...latest }),
    prisma.lifePortfolio.findFirst({ where: { userId }, ...latest }),
  ]);

  const signals: { kind: string; text: string }[] = [];
  if (sk) signals.push({ kind: "knowledge", text: `Specific knowledge ${pct(sk.score)}/100 — ${sk.summary || "no summary"}` });
  if (ts) signals.push({ kind: "knowledge", text: `Talent stack ${pct(ts.score)}/100 — ${ts.identityStack || ts.combination.join(" × ")}` });
  if (lev) signals.push({ kind: "leverage", text: `Leverage ${pct(lev.score)}/100; time-for-money ${Math.round((lev.timeForMoney ?? 0) * 100)}%` });
  if (jud) signals.push({ kind: "decision", text: `Judgment ${pct(jud.score)}/100; blind spots: ${jud.blindSpots.join(", ") || "none logged"}` });
  if (wealth) signals.push({ kind: "asset", text: `Wealth ${pct(wealth.score)}/100; ownership ${Math.round((wealth.ownershipRatio ?? 0) * 100)}%; bottleneck: ${wealth.bottleneck || "n/a"}` });
  if (game) signals.push({ kind: "game", text: `Top long-term game: ${game.name} (${pct(game.score)}/100)` });
  if (freedom) signals.push({ kind: "freedom", text: `Freedom ${pct(freedom.score)}/100` });
  if (happiness) signals.push({ kind: "happiness", text: `Happiness ${pct(happiness.score)}/100; desire load ${Math.round((happiness.desireLoad ?? 0) * 100)}%` });
  if (portfolio) signals.push({ kind: "knowledge", text: `Life portfolio ${pct(portfolio.score)}/100; ${portfolio.imbalance || "balanced"}` });

  if (signals.length) {
    const twin = await prisma.navalDigitalTwinProfile.upsert({
      where: { userId }, update: {}, create: { userId, summary: "", driftScore: 0 },
    });
    // refresh the auto-collected memory layer
    await prisma.navalTwinMemory.deleteMany({ where: { userId, twinId: twin.id, weight: 0.9 } });
    await prisma.navalTwinMemory.createMany({
      data: signals.map((s) => ({ userId, twinId: twin.id, kind: s.kind, content: s.text, weight: 0.9 })),
    });
  }
  return signals.map((s) => s.text);
}
