// Emporion — order service. Virtual goods: payment and fulfillment happen in ONE
// transaction, so a paid order is always a delivered order (支付后立即发货完成).
// `payAndFulfill` is idempotent: re-paying a COMPLETED order is a no-op, which is
// exactly what a real payment-gateway notify callback needs (it may retry).
import { prisma } from "../db";
import { HttpError } from "../http";
import { TIER_RANK, type Tier } from "../membership/plans";

const DAY_MS = 86_400_000;

export async function createOrder(userId: string, slug: string, quantity = 1) {
  const product = await prisma.virtualProduct.findFirst({ where: { slug, active: true } });
  if (!product) throw new HttpError(404, "商品不存在或已下架");
  const qty = Math.max(1, Math.min(99, Math.floor(quantity)));
  const amount = Number(product.price) * qty;
  const outTradeNo = "EMP" + Date.now() + Math.floor(Math.random() * 1000);
  const order = await prisma.storeOrder.create({
    data: {
      userId, productId: product.id, productName: product.name, quantity: qty,
      amount, currency: product.currency, status: "CREATED", provider: "mock", outTradeNo,
    },
  });
  // In production: create the real payment here and return its payUrl.
  return { order, payUrl: null as string | null };
}

/** Mark paid + deliver instantly, atomically. Safe to call twice (gateway retries). */
export async function payAndFulfill(orderId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.storeOrder.findFirst({ where: { id: orderId, userId }, include: { product: true } });
    if (!order) throw new HttpError(404, "订单不存在");
    if (order.status === "COMPLETED") return order; // idempotent
    if (order.status === "CANCELLED") throw new HttpError(400, "订单已取消");

    const now = new Date();
    const p = order.product;
    let note = "";

    if (p.kind === "MEMBERSHIP_DAYS" && p.grantTier && p.grantTier !== "FREE") {
      const days = p.grantDays * order.quantity;
      const existing = await tx.membership.findUnique({ where: { userId } });
      const activeNow = !!(existing?.expiresAt && existing.expiresAt.getTime() > now.getTime());
      // Guard: never downgrade an active higher tier (e.g. PRO buying a PLUS pack).
      if (activeNow && TIER_RANK[existing!.tier as Tier] > TIER_RANK[p.grantTier as Tier]) {
        throw new HttpError(400, "当前会员等级更高，无需购买较低等级的时长包");
      }
      const stack = activeNow && existing!.tier === p.grantTier;
      const base = stack ? existing!.expiresAt!.getTime() : now.getTime();
      const expiresAt = new Date(base + days * DAY_MS);
      await tx.membership.upsert({
        where: { userId },
        update: { tier: p.grantTier, status: "ACTIVE", expiresAt },
        create: { userId, tier: p.grantTier, status: "ACTIVE", expiresAt },
      });
      note = `已开通 ${p.grantTier} 会员 ${days} 天，有效期至 ${expiresAt.toISOString().slice(0, 10)}`;
    } else if (p.kind === "CREDITS") {
      const credits = p.grantCredits * order.quantity;
      await tx.userCredit.upsert({
        where: { userId },
        update: { balance: { increment: credits } },
        create: { userId, balance: credits },
      });
      await tx.creditLedger.create({ data: { userId, delta: credits, reason: `购买 ${p.name}`, orderId: order.id } });
      note = `已到账 ${credits} 点`;
    } else if (p.kind === "CONTENT" && p.grantContentKey) {
      await tx.contentUnlock.upsert({
        where: { userId_contentKey: { userId, contentKey: p.grantContentKey } },
        update: {},
        create: { userId, contentKey: p.grantContentKey, orderId: order.id },
      });
      note = `已解锁「${p.name}」`;
    } else {
      throw new HttpError(500, "商品履约配置无效");
    }

    return tx.storeOrder.update({
      where: { id: order.id },
      data: { status: "COMPLETED", paidAt: now, deliveredAt: now, deliveryNote: note },
    });
  });
}

export async function payAndFulfillByOutTradeNo(outTradeNo: string) {
  const order = await prisma.storeOrder.findUnique({ where: { outTradeNo } });
  if (!order) throw new HttpError(404, "订单不存在");
  return payAndFulfill(order.id, order.userId);
}

/** A user's wallet + unlocks, for the store page. */
export async function getEntitlements(userId: string) {
  const [credit, unlocks] = await Promise.all([
    prisma.userCredit.findUnique({ where: { userId } }),
    prisma.contentUnlock.findMany({ where: { userId }, select: { contentKey: true } }),
  ]);
  return { credits: credit?.balance ?? 0, unlockedKeys: unlocks.map((u) => u.contentKey) };
}
