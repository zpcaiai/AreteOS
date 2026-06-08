import { prisma } from "../db";

export async function overview() {
  const [users, ordersTotal, ordersDone, revenueAgg, byTier, productsActive, posts, recentOrders, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.storeOrder.count(),
      prisma.storeOrder.count({ where: { status: "COMPLETED" } }),
      prisma.storeOrder.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
      prisma.membership.groupBy({ by: ["tier"], _count: { _all: true } }),
      prisma.virtualProduct.count({ where: { active: true } }),
      prisma.communityPost.count().catch(() => 0),
      prisma.storeOrder.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, email: true, name: true, createdAt: true } }),
    ]);
  const tiers: Record<string, number> = {};
  for (const t of byTier) tiers[t.tier] = t._count._all;
  return {
    users, ordersTotal, ordersDone,
    revenue: Number(revenueAgg._sum.amount ?? 0),
    tiers, productsActive, posts, recentOrders, recentUsers,
  };
}

const DAY = 86_400_000;
/** Manually grant/extend a user's membership (stacks remaining same-tier time). */
export async function grantMembership(userId: string, tier: "PLUS" | "PRO", days: number) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!u) throw new Error("用户不存在");
  const existing = await prisma.membership.findUnique({ where: { userId } });
  const now = Date.now();
  const active = existing?.expiresAt && existing.expiresAt.getTime() > now && existing.tier === tier;
  const base = active ? existing!.expiresAt!.getTime() : now;
  const expiresAt = new Date(base + days * DAY);
  return prisma.membership.upsert({
    where: { userId },
    update: { tier, status: "ACTIVE", expiresAt },
    create: { userId, tier, status: "ACTIVE", expiresAt },
  });
}
