import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { getActiveMembership } from "@/lib/membership/service";
import { TIERS, PRICES, PERIOD_DAYS } from "@/lib/membership/plans";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const active = await getActiveMembership(userId);
    const orders = await prisma.membershipOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 });
    return ok({ active, tiers: TIERS, prices: PRICES, periodDays: PERIOD_DAYS, orders });
  });
}
