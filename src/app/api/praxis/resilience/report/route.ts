import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const patterns = await prisma.resiliencePattern.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    const overall = patterns.length ? patterns.reduce((a, p) => a + p.score, 0) / patterns.length : 0;
    return ok({ patterns, overall });
  });
}
