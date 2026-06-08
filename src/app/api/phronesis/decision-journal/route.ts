import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { DecisionJournalGuide } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const journals = await prisma.decisionJournal.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return ok({ journals });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ decision: z.string().min(1), context: z.string().optional() }));
    const out = await DecisionJournalGuide.run({ decision: b.decision, context: b.context });
    const journal = await prisma.decisionJournal.create({ data: {
      userId, decision: b.decision, context: out.framing, expectedOutcome: out.expectedOutcome, modelsUsed: out.modelsToApply,
    } });
    await prisma.$transaction(out.assumptions.map((a) =>
      prisma.decisionAssumption.create({ data: { journalId: journal.id, assumption: a } })));
    return created({ journal, assumptions: out.assumptions });
  });
}
