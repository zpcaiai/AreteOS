import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { MontessoriEnvironmentAdvisor } from "@/lib/agents/registry";
import { environmentScore } from "@/lib/genius/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), description: z.string().min(1) }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const out = await MontessoriEnvironmentAdvisor.run({ description: b.description });
    const c = out.scores;
    const env = await prisma.learningEnvironment.create({ data: {
      childId: b.childId, noise: c.noise, distraction: c.distraction, autonomy: c.autonomy,
      exploration: c.exploration, accessibility: c.accessibility, qualityScore: environmentScore(c), upgradePlan: out.upgradePlan,
    } });
    return created({ environment: env, upgradePlan: out.upgradePlan });
  });
}
