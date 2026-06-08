import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeOrgHealth } from "@/lib/praxis/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, founder, identity, factors, values, principles, bottlenecks, playbooks, history] = await Promise.all([
      computeOrgHealth(userId),
      prisma.founderProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.companyIdentity.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
      prisma.successFactor.findMany({ where: { userId }, orderBy: { scalabilityScore: "desc" }, take: 12 }),
      prisma.coreBusinessValue.findMany({ where: { userId }, orderBy: { rank: "asc" } }),
      prisma.operatingPrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 12 }),
      prisma.scalingBottleneck.findMany({ where: { userId, resolved: false }, orderBy: { severity: "desc" } }),
      prisma.replicationPlaybook.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.organizationalHealthSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
    ]);
    return ok({ health, founder, identity, factors, values, principles, bottlenecks, playbooks, history });
  });
}
