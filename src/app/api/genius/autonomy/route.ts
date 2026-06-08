import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { LearningAutonomyCoach } from "@/lib/agents/registry";
import { autonomyScore } from "@/lib/genius/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), observations: z.array(z.string()).default([]) }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const out = await LearningAutonomyCoach.run({ observations: b.observations });
    const c = out.scores;
    const log = await prisma.learningAutonomyLog.create({ data: {
      childId: b.childId, initiative: c.initiative, ownership: c.ownership, persistence: c.persistence,
      focus: c.focus, independentLearning: c.independentLearning, autonomyScore: autonomyScore(c), note: out.plan.join(" · "),
    } });
    return created({ log, plan: out.plan });
  });
}
