import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeOrgHealth } from "@/lib/praxis/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const h = await computeOrgHealth(userId);
    const snapshot = await prisma.organizationalHealthSnapshot.create({ data: {
      userId, founderDependency: h.founderDependency, repeatability: h.repeatability, scalability: h.scalability,
      valuesAlignment: h.valuesAlignment, decisionConsistency: h.decisionConsistency, collaborationQuality: h.collaborationQuality,
      leadershipMaturity: h.leadershipMaturity, resilience: h.resilience, replicationReadiness: h.replicationReadiness,
      organizationalHealth: h.organizationalHealth,
    } });
    return ok({ health: h, snapshot });
  });
}
