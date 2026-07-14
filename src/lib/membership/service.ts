import { prisma } from "../db";
import { HttpError } from "../http";
import { PERIOD_DAYS, TIER_RANK, hasFeature, type Tier, type Period } from "./plans";
import { teamGrantedTier } from "../teams";

export interface ActiveMembership {
  tier: Tier;
  rank: number;
  expiresAt: Date | null;
  period: Period | null;
  /** Where the effective tier came from — a team seat can grant PRO. */
  source?: "personal" | "team";
}

/** Resolve the user's effective tier, downgrading to FREE if expired. */
export async function getActiveMembership(userId: string): Promise<ActiveMembership> {
  const personal = await personalMembership(userId);
  // A team seat can grant PRO. Fail-safe and upgrade-only: it never downgrades the
  // user's personal tier, and a missing teams table / DB blip is ignored.
  const granted = await teamGrantedTier(userId);
  if (granted) {
    const gTier = granted as Tier;
    const gRank = TIER_RANK[gTier] ?? 0;
    if (gRank > personal.rank) {
      return { tier: gTier, rank: gRank, expiresAt: personal.expiresAt, period: null, source: "team" };
    }
  }
  return { ...personal, source: "personal" };
}

async function personalMembership(userId: string): Promise<ActiveMembership> {
  const m = await prisma.membership.findUnique({ where: { userId } });
  if (!m || m.tier === "FREE") return { tier: "FREE", rank: 0, expiresAt: null, period: null };
  const expired = m.expiresAt != null && m.expiresAt.getTime() < Date.now();
  if (expired) {
    if (m.status !== "EXPIRED") await prisma.membership.update({ where: { userId }, data: { status: "EXPIRED" } });
    return { tier: "FREE", rank: 0, expiresAt: m.expiresAt, period: m.period as Period | null };
  }
  const tier = m.tier as Tier;
  return { tier, rank: TIER_RANK[tier], expiresAt: m.expiresAt, period: m.period as Period | null };
}

/** Throw 402 if the user's active tier doesn't include the feature. */
export async function requireFeature(userId: string, featureKey: string): Promise<void> {
  const { tier } = await getActiveMembership(userId);
  if (!hasFeature(tier, featureKey)) {
    throw new HttpError(402, `该功能需要升级会员（${featureKey}）`);
  }
}

/** Mark an order paid and (re)activate the membership, stacking remaining time. */
export async function activateOrder(orderId: string, userId: string) {
  const order = await prisma.membershipOrder.findFirst({ where: { id: orderId, userId } });
  if (!order) throw new HttpError(404, "订单不存在");
  if (order.status !== "PAID") {
    await prisma.membershipOrder.update({ where: { id: order.id }, data: { status: "PAID", paidAt: new Date() } });
  }
  const existing = await prisma.membership.findUnique({ where: { userId } });
  const base = existing?.expiresAt && existing.expiresAt.getTime() > Date.now() && existing.tier === order.tier
    ? existing.expiresAt.getTime()
    : Date.now();
  const expiresAt = new Date(base + PERIOD_DAYS[order.period as Period] * 86_400_000);
  const membership = await prisma.membership.upsert({
    where: { userId },
    update: { tier: order.tier, period: order.period, status: "ACTIVE", expiresAt },
    create: { userId, tier: order.tier, period: order.period, status: "ACTIVE", expiresAt },
  });
  return { order, membership };
}

export async function activateOrderByOutTradeNo(outTradeNo: string) {
  const order = await prisma.membershipOrder.findUnique({ where: { outTradeNo } });
  if (!order) throw new HttpError(404, "订单不存在");
  return activateOrder(order.id, order.userId);
}
