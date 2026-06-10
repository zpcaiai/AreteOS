import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, pagination, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const page = pagination(req, { limit: 30, max: 100 });
    const [orders, total] = await Promise.all([
      prisma.storeOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, skip: page.skip, take: page.limit }),
      prisma.storeOrder.count({ where: { userId } }),
    ]);
    return ok({ orders, pagination: { page: page.page, limit: page.limit, total } });
  });
}
