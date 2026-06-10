import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, notFound, route } from "@/lib/http";
import { DecisionArchitect } from "@/lib/agents/registry";
import { decisionQualityScore } from "@/lib/scoring";
import { emit } from "@/lib/events";
import { recordProgress } from "@/lib/analytics";
import { memoryContext, remember } from "@/lib/memory";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const decision = await prisma.decision.findFirst({ where: { id, userId }, include: { options: true } });
    if (!decision) return notFound("Decision not found");

    const [mission, identity, values] = await Promise.all([
      prisma.mission.findFirst({ where: { userId, active: true } }),
      prisma.identity.findFirst({ where: { userId, active: true } }),
      prisma.valueRanking.findMany({ where: { userId }, orderBy: { rank: "asc" }, take: 5, include: { value: true } }),
    ]);

    const relevantMemory = await memoryContext(
      userId,
      `${decision.title}\n${decision.context}\n${decision.options.map((o) => o.label).join("\n")}`,
      { kinds: ["DECISION", "REFLECTION", "SHADOW"], limit: 5 },
    );

    const result = await DecisionArchitect.run({
      title: decision.title, context: decision.context,
      options: decision.options.map((o) => o.label),
      mission: mission?.statement, identity: identity?.name,
      values: values.map((v) => v.value.name),
      memoryContext: relevantMemory,
    });

    // Persist one review per option; recompute quality server-side (don't trust the model's number).
    let best = { option: "", quality: -1 };
    for (const r of result.reviews) {
      const quality = decisionQualityScore(r);
      if (quality > best.quality) best = { option: r.option, quality };
      const option = decision.options.find((o) => o.label === r.option);
      await prisma.decisionReview.create({
        data: {
          decisionId: decision.id, optionId: option?.id ?? null,
          missionFit: r.missionFit, identityFit: r.identityFit, valueFit: r.valueFit,
          expectedValue: r.expectedValue, opportunityCost: r.opportunityCost, secondOrder: r.secondOrder, risk: r.risk,
          reversibility: r.reversibility, shadowMotive: r.shadowMotive, quality, note: r.note,
        },
      });
    }
    await prisma.decision.update({ where: { id: decision.id }, data: { status: "REVIEWED", quality: best.quality } });
    await emit({ userId, aggregateType: "Decision", aggregateId: decision.id, type: "DecisionReviewed", payload: { best, recommendation: result.recommendation } });
    await remember({
      userId,
      kind: "DECISION",
      sourceType: "Decision",
      sourceId: decision.id,
      title: decision.title,
      content: `Context: ${decision.context}\nOptions: ${decision.options.map((o) => o.label).join(", ")}\nBest: ${best.option} (${best.quality.toFixed(2)})\nRecommendation: ${result.recommendation}`,
      metadata: { best, reviewCount: result.reviews.length },
      importance: Math.max(0.5, best.quality),
      occurredAt: decision.createdAt,
    }).catch(() => null);
    await recordProgress(userId).catch(() => null);
    return ok({ recommendation: result.recommendation, best, reviews: result.reviews });
  });
}
