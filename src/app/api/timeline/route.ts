import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [snapshots, identityScores, transitions, identityHistory] = await Promise.all([
      prisma.scoreSnapshot.findMany({ where: { userId }, orderBy: { date: "asc" } }),
      prisma.identityScore.findMany({ where: { identity: { userId } }, include: { identity: { select: { name: true } } }, orderBy: { date: "asc" } }),
      prisma.personalityTransition.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
      prisma.identityHistory.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 50 }),
    ]);
    return ok({ snapshots, identityScores, transitions, identityHistory });
  });
}
