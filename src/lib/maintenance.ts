import { prisma } from "./db";

export async function runMaintenance(now = new Date()) {
  const staleOrder = new Date(now.getTime() - 24 * 60 * 60_000);
  const [sessions, tokens, rateLimits, membershipOrders, storeOrders, teams] = await prisma.$transaction([
    prisma.authSession.deleteMany({ where: { OR: [{ expiresAt: { lt: now } }, { revokedAt: { lt: staleOrder } }] } }),
    prisma.authToken.deleteMany({ where: { OR: [{ expiresAt: { lt: now } }, { usedAt: { lt: staleOrder } }] } }),
    prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.membershipOrder.updateMany({ where: { status: "CREATED", createdAt: { lt: staleOrder } }, data: { status: "CANCELLED" } }),
    prisma.storeOrder.updateMany({ where: { status: "CREATED", createdAt: { lt: staleOrder } }, data: { status: "CANCELLED" } }),
    prisma.team.updateMany({ where: { status: "ACTIVE", expiresAt: { lt: now } }, data: { status: "EXPIRED" } }),
  ]);
  return { sessions: sessions.count, tokens: tokens.count, rateLimits: rateLimits.count, membershipOrders: membershipOrders.count, storeOrders: storeOrders.count, teams: teams.count };
}
