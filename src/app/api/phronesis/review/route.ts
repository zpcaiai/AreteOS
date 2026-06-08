import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({
      journalId: z.string().min(1), actualOutcome: z.string().default(""),
      lessons: z.array(z.string()).default([]), failedModel: z.string().default(""),
      wrongAssumptions: z.array(z.string()).default([]), surprise: z.number().min(0).max(1).default(0),
    }));
    await prisma.decisionJournal.update({ where: { id: b.journalId }, data: { actualOutcome: b.actualOutcome, resolved: true } });
    await prisma.decisionOutcome.create({ data: { journalId: b.journalId, outcome: b.actualOutcome, surprise: b.surprise } });
    const review = await prisma.cogDecisionReview.create({ data: {
      userId, journalId: b.journalId, lessons: b.lessons, failedModel: b.failedModel, wrongAssumptions: b.wrongAssumptions,
    } });
    return created({ review });
  });
}
