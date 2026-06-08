import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeWorldview } from "@/lib/cosmos/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, profile, meaning, conflicts, principles, timeline] = await Promise.all([
      computeWorldview(userId),
      prisma.worldviewProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.meaningProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.assumptionConflict.findMany({ where: { userId }, orderBy: { severity: "desc" }, take: 10 }),
      prisma.lifePrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.worldviewEvolution.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
    ]);
    return ok({ health, profile, meaning, conflicts, principles, timeline });
  });
}
