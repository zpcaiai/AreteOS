import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { getEntitlements } from "@/lib/emporion/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [products, orders, entitlements] = await Promise.all([
      prisma.virtualProduct.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { price: "asc" }] }),
      prisma.storeOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
      getEntitlements(userId),
    ]);
    return ok({ products, orders, entitlements });
  });
}
