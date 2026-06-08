import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { WorldviewCoach } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const worldview = await prisma.worldview.findFirst({
      where: { userId }, orderBy: { createdAt: "desc" }, include: { dimensions: true },
    });
    const assessments = await prisma.worldviewAssessment.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
    return ok({ worldview, assessments });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      answers: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
    }));
    const out = await WorldviewCoach.run({ answers: body.answers });
    await prisma.worldviewAssessment.createMany({ data: body.answers.map((a) => ({ userId, question: a.question, answer: a.answer })) });
    const worldview = await prisma.worldview.create({
      data: {
        userId,
        summary: out.hiddenAssumptions.join(" · "),
        dimensions: { create: out.dimensions.map((d) => ({ dimension: d.dimension, stance: d.stance })) },
      },
      include: { dimensions: true },
    });
    return created({ worldview, hiddenAssumptions: out.hiddenAssumptions, testsToRun: out.testsToRun });
  });
}
