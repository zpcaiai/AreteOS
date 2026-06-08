import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, notFound, parseBody, route } from "@/lib/http";
import { LearningPathGenerator } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ adaptationId: z.string().min(1), goal: z.string().default("") }));
    const adaptation = await prisma.blueprintAdaptation.findFirst({
      where: { id: body.adaptationId, userId }, include: { strategy: { include: { genius: true } } },
    });
    if (!adaptation) return notFound("Adaptation not found");

    const out = await LearningPathGenerator.run({
      roleModel: adaptation.strategy.genius.name,
      blueprintSummary: adaptation.summary || adaptation.identity,
      goal: body.goal,
    });

    const path = await prisma.learningPath.create({
      data: {
        userId, adaptationId: adaptation.id, strategyId: adaptation.strategyId, title: `Path: ${adaptation.title}`,
        steps: { create: out.steps.map((s, i) => ({ stage: s.stage, order: i, action: s.action })) },
      },
      include: { steps: { orderBy: { order: "asc" } } },
    });
    return created({ path });
  });
}
