// Ambient insights: the system notices problems before the user asks.
// Run nightly per user; each detector is cheap, deterministic, and explains
// itself. Insights land in twin_insights (surfaced on /twin), long-term memory
// (so the coach can cite them), and the domain-event log.

import { prisma } from "./db";
import { emit } from "./events";
import { remember } from "./memory";
import { dueDecisionReviews } from "./naval/plan";

const DAY = 86_400_000;

/** Naval global score dropped sharply between snapshots. */
async function navalScoreDrop(userId: string): Promise<string | null> {
  const [latest, previous] = await prisma.navalScoreSnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 2,
  });
  if (!latest || !previous) return null;
  const delta = latest.globalScore - previous.globalScore;
  return delta <= -5
    ? `Naval score dropped ${Math.abs(Math.round(delta))} points since the previous snapshot. Review the lowest driver before adding new goals.`
    : null;
}

/** Decision reviews due (close the prediction loop). */
async function decisionReviewsDue(userId: string): Promise<string | null> {
  const due = await dueDecisionReviews(userId);
  return due.length
    ? `${due.length} decision review${due.length === 1 ? " is" : "s are"} due. Close the prediction loop before making the next major call.`
    : null;
}

/** A shadow pattern fired again this week after being quiet. */
async function shadowRecurrence(userId: string): Promise<string | null> {
  const weekAgo = new Date(Date.now() - 7 * DAY);
  const patterns = await prisma.shadowPattern.findMany({
    where: { userId },
    select: {
      type: true,
      events: { select: { date: true }, orderBy: { date: "desc" }, take: 12 },
    },
  });
  for (const p of patterns) {
    const recent = p.events.filter((e) => e.date >= weekAgo).length;
    const older = p.events.length - recent;
    if (recent >= 2 && older >= 1) {
      return `Your "${p.type}" shadow pattern fired ${recent} times this week — a known loop is repeating. Re-read its intervention before it compounds.`;
    }
  }
  return null;
}

/** Habit adherence fell sharply versus the prior week. */
async function habitAdherenceDrop(userId: string): Promise<string | null> {
  const now = Date.now();
  const [thisWeek, lastWeek] = await Promise.all([
    prisma.habitLog.count({ where: { habit: { userId, active: true }, done: true, date: { gte: new Date(now - 7 * DAY) } } }),
    prisma.habitLog.count({
      where: { habit: { userId, active: true }, done: true, date: { gte: new Date(now - 14 * DAY), lt: new Date(now - 7 * DAY) } },
    }),
  ]);
  if (lastWeek >= 4 && thisWeek <= lastWeek / 2) {
    return `Habit completions halved this week (${thisWeek} vs ${lastWeek}). Shrink the habit before you abandon it — consistency beats intensity.`;
  }
  return null;
}

/** No reflection logged for a week. */
async function reflectionStale(userId: string): Promise<string | null> {
  const last = await prisma.reflection.findFirst({ where: { userId }, orderBy: { date: "desc" }, select: { date: true } });
  if (!last) return null;
  const days = Math.floor((Date.now() - last.date.getTime()) / DAY);
  return days >= 7
    ? `No reflection in ${days} days. The reflection score multiplies everything else — one honest paragraph tonight restarts the loop.`
    : null;
}

export async function runAmbientInsights(userId: string) {
  const detected = await Promise.allSettled([
    navalScoreDrop(userId),
    decisionReviewsDue(userId),
    shadowRecurrence(userId),
    habitAdherenceDrop(userId),
    reflectionStale(userId),
  ]);
  const insights = detected
    .filter((r): r is PromiseFulfilledResult<string | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((v): v is string => Boolean(v));

  for (const insight of insights) {
    await prisma.twinInsight.create({
      data: { userId, insight, basis: "ambient-nightly" },
    });
    await remember({
      userId,
      kind: "REVIEW",
      sourceType: "AmbientInsight",
      sourceId: insight.slice(0, 80),
      title: "Ambient insight",
      content: insight,
      importance: 0.75,
    }).catch(() => null);
    await emit({ userId, aggregateType: "AmbientInsight", aggregateId: "nightly", type: "AmbientInsightGenerated", payload: { insight } });
  }

  return insights;
}
