import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { GrowthMindsetCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), statements: z.array(z.string()).default([]) }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const out = await GrowthMindsetCoach.run({ statements: b.statements });
    const logs = await prisma.$transaction(out.reframes.map((r) =>
      prisma.growthMindsetLog.create({ data: { childId: b.childId, fixedStatement: r.fixed, growthReframe: r.growth, mindset: "GROWTH" } })));
    return created({ logs, growthMindsetScore: out.growthMindsetScore, plan: out.plan });
  });
}
