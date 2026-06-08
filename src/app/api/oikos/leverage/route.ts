import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { LeverageAnalyzer } from "@/lib/agents/registry";
import { leverageScore } from "@/lib/oikos/scoring";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [logs, activities] = await Promise.all([
      prisma.leverageLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.managementActivity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);
    return ok({ logs, activities });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({
      activities: z.array(z.object({ activity: z.string(), hoursPerWeek: z.number().default(1) })).default([]),
      organizationId: z.string().optional(),
    }));
    const out = await LeverageAnalyzer.run({ activities: b.activities });
    await prisma.$transaction(out.classified.map((a) =>
      prisma.managementActivity.create({ data: {
        userId, organizationId: b.organizationId ?? null, activity: a.activity, tier: a.tier,
        hoursPerWeek: b.activities.find((x) => x.activity === a.activity)?.hoursPerWeek ?? 0,
      } })));
    const score = leverageScore({ lowShare: out.shares.low, mediumShare: out.shares.medium, highShare: out.shares.high });
    const log = await prisma.leverageLog.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      lowShare: out.shares.low, mediumShare: out.shares.medium, highShare: out.shares.high,
      leverageScore: score, improvementPlan: out.improvementPlan,
    } });
    return created({ log, classified: out.classified });
  });
}
