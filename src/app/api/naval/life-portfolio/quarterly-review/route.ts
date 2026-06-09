import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const portfolio = await prisma.lifePortfolio.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { areas: true } });
    const meta = (portfolio?.metadata ?? {}) as Record<string, unknown>;
    return ok({ areas: portfolio?.areas ?? [], quarterlyReview: (meta.quarterlyReview as string[]) ?? [], imbalance: portfolio?.imbalance ?? "" });
  });
}
