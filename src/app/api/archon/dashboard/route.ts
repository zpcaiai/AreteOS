import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeLeadership } from "@/lib/archon/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, leverage, vision, pipeline, growth, blueprint] = await Promise.all([
      computeLeadership(userId),
      prisma.leadershipLeverageMap.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.visionStatement.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
      prisma.futureLeaderProfile.findMany({ where: { userId }, orderBy: { readinessScore: "desc" }, take: 10 }),
      prisma.leadershipGrowthPlan.findMany({ where: { userId, active: true }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.cultureBlueprint.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ health, leverage, vision, pipeline, growth, blueprint });
  });
}
