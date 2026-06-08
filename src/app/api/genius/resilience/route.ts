import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ResilienceCoach } from "@/lib/agents/registry";
import { resilienceScore } from "@/lib/genius/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), situation: z.string().min(1), observations: z.array(z.string()).default([]) }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const out = await ResilienceCoach.run({ situation: b.situation, observations: b.observations });
    const c = out.scores;
    const log = await prisma.resilienceLog.create({ data: {
      childId: b.childId, failureRecovery: c.failureRecovery, persistence: c.persistence, riskTaking: c.riskTaking,
      emotionalRegulation: c.emotionalRegulation, resilienceScore: resilienceScore(c), note: out.plan.join(" · "),
    } });
    return created({ log, plan: out.plan });
  });
}
