// MISSION OS — periodic reviews (Dalio-style). Aggregates activity + scores over
// a period into a stored Review with a deterministic summary + metrics JSON.

import { prisma } from "./db";
import { computeScores } from "./analytics";
import type { ReviewPeriod } from "@prisma/client";

const DAY = 86_400_000;

function isoWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / DAY - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return { year: date.getUTCFullYear(), week };
}

export function periodKey(period: ReviewPeriod, date = new Date()): string {
  const y = date.getFullYear();
  if (period === "DAILY") return date.toISOString().slice(0, 10);
  if (period === "WEEKLY") {
    const { year, week } = isoWeek(date);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }
  if (period === "MONTHLY") return `${y}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${y}-Q${Math.floor(date.getMonth() / 3) + 1}`;
}

export function periodStart(period: ReviewPeriod, date = new Date()): Date {
  const d = new Date(date);
  if (period === "DAILY") return new Date(d.setHours(0, 0, 0, 0));
  if (period === "WEEKLY") return new Date(date.getTime() - 7 * DAY);
  if (period === "MONTHLY") return new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
}

export async function generateReview(userId: string, period: ReviewPeriod, date = new Date()) {
  const start = periodStart(period, date);
  const key = periodKey(period, date);

  const [{ scores, stage }, decisionsReviewed, reflections, habitLogs, lessons, shadowEvents] = await Promise.all([
    computeScores(userId),
    prisma.decision.count({ where: { userId, status: "REVIEWED", createdAt: { gte: start } } }),
    prisma.reflection.count({ where: { userId, date: { gte: start } } }),
    prisma.habitLog.count({ where: { habit: { userId }, done: true, date: { gte: start } } }),
    prisma.lesson.findMany({ where: { userId, createdAt: { gte: start } }, select: { text: true }, take: 10 }),
    prisma.shadowEvent.count({ where: { userId, date: { gte: start } } }),
  ]);

  const growthPct = Math.round(scores.growth * 100);
  const summary = [
    `${period} review (${key}): Growth ${growthPct}/100, stage ${stage.current} (${Math.round(stage.progress * 100)}% → ${stage.next ?? "—"}).`,
    `Activity: ${decisionsReviewed} decisions reviewed, ${reflections} reflections, ${habitLogs} habit completions, ${shadowEvents} shadow events.`,
    lessons.length ? `Lessons: ${lessons.map((l) => l.text).join(" · ")}` : "No lessons recorded this period.",
    `Weakest layer to focus next: ${weakestLayer(scores as unknown as Record<string, number>)}.`,
  ].join("\n");

  const metrics = { scores, stage: stage.current, activity: { decisionsReviewed, reflections, habitLogs, shadowEvents } };

  const metricsJson = metrics as unknown as import("@prisma/client").Prisma.InputJsonValue;
  return prisma.review.upsert({
    where: { userId_period_periodKey: { userId, period, periodKey: key } },
    update: { summary, metrics: metricsJson },
    create: { userId, period, periodKey: key, summary, metrics: metricsJson },
  });
}

function weakestLayer(scores: Record<string, number>): string {
  const core: [string, number][] = [
    ["Mission", scores.missionAlignment], ["Identity", scores.identityAlignment],
    ["Values", scores.valueIntegrity], ["Mental Models", scores.mentalModelUsage],
    ["First Principles", scores.firstPrinciple], ["Decisions", scores.decisionQuality],
    ["Habits", scores.habitConsistency], ["Reflection", scores.reflection], ["Mastery", scores.mastery],
  ];
  return core.sort((a, b) => a[1] - b[1])[0][0];
}
