import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [metrics, influence] = await Promise.all([
      prisma.leadershipMetric.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 12 }),
      prisma.influenceLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    ]);
    return ok({ metrics, influence });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const s = z.number().min(0).max(1).default(0);
    const body = await parseBody(req, z.object({
      communication: s, influence: s, delegation: s, teamBuilding: s, decisionQuality: s,
    }));
    const metric = await prisma.leadershipMetric.create({ data: { userId, ...body } });
    return created({ metric });
  });
}
