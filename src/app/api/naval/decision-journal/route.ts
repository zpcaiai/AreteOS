import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, pagination, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const page = pagination(req, { limit: 30, max: 100 });
    const [entries, total] = await Promise.all([
      prisma.decisionJournalEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { reviews: true }, skip: page.skip, take: page.limit }),
      prisma.decisionJournalEntry.count({ where: { userId } }),
    ]);
    return ok({ entries, pagination: { page: page.page, limit: page.limit, total } });
  });
}
