import { prisma } from "./db";
import { emit } from "./events";
import { remember } from "./memory";
import { dueDecisionReviews } from "./naval/plan";

export async function runAmbientInsights(userId: string) {
  const insights: string[] = [];

  const [latest, previous] = await prisma.navalScoreSnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  if (latest && previous) {
    const delta = latest.globalScore - previous.globalScore;
    if (delta <= -5) {
      insights.push(`Naval score dropped ${Math.abs(Math.round(delta))} points since the previous snapshot. Review the lowest driver before adding new goals.`);
    }
  }

  const due = await dueDecisionReviews(userId);
  if (due.length) {
    insights.push(`${due.length} decision review${due.length === 1 ? " is" : "s are"} due. Close the prediction loop before making the next major call.`);
  }

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
