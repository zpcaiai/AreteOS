import { prisma } from "./db";

export function retentionDays(name: string, fallback: number, env: Record<string, string | undefined> = process.env) {
  const parsed = Number(env[name] ?? fallback);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 3650 ? parsed : fallback;
}

export async function runMaintenance(now = new Date()) {
  const staleOrder = new Date(now.getTime() - 24 * 60 * 60_000);
  const analyticsCutoff = new Date(now.getTime() - retentionDays("ANALYTICS_RETENTION_DAYS", 180) * 86_400_000);
  const auditCutoff = new Date(now.getTime() - retentionDays("SECURITY_AUDIT_RETENTION_DAYS", 2555) * 86_400_000);
  const coachDays = retentionDays("COACH_CONTENT_RETENTION_DAYS", 0);
  const coachCutoff = coachDays ? new Date(now.getTime() - coachDays * 86_400_000) : new Date(0);
  const [sessions, tokens, rateLimits, membershipOrders, storeOrders, teams, analytics, audits, coachMessages] = await prisma.$transaction([
    prisma.authSession.deleteMany({ where: { OR: [{ expiresAt: { lt: now } }, { revokedAt: { lt: staleOrder } }] } }),
    prisma.authToken.deleteMany({ where: { OR: [{ expiresAt: { lt: now } }, { usedAt: { lt: staleOrder } }] } }),
    prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.membershipOrder.updateMany({ where: { status: "CREATED", createdAt: { lt: staleOrder } }, data: { status: "CANCELLED" } }),
    prisma.storeOrder.updateMany({ where: { status: "CREATED", createdAt: { lt: staleOrder } }, data: { status: "CANCELLED" } }),
    prisma.team.updateMany({ where: { status: "ACTIVE", expiresAt: { lt: now } }, data: { status: "EXPIRED" } }),
    prisma.analyticsEvent.deleteMany({ where: { occurredAt: { lt: analyticsCutoff } } }),
    prisma.securityAuditEvent.deleteMany({ where: { occurredAt: { lt: auditCutoff } } }),
    prisma.coachMessage.deleteMany({ where: { createdAt: { lt: coachCutoff } } }),
  ]);
  return { sessions: sessions.count, tokens: tokens.count, rateLimits: rateLimits.count, membershipOrders: membershipOrders.count, storeOrders: storeOrders.count, teams: teams.count, analytics: analytics.count, audits: audits.count, coachMessages: coachMessages.count };
}
