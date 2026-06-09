import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const opportunities = await prisma.startupOpportunity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { experiments: true }, take: 50 });
    return ok({ opportunities });
  });
}
