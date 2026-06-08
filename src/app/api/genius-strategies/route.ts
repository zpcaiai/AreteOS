import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [geniuses, adoptions] = await Promise.all([
      prisma.genius.findMany({ orderBy: { name: "asc" }, include: { strategies: { orderBy: { createdAt: "asc" } } } }),
      prisma.strategyAdoption.findMany({ where: { userId }, include: { logs: { orderBy: { date: "desc" }, take: 5 } } }),
    ]);
    return ok({ geniuses, adoptions });
  });
}
