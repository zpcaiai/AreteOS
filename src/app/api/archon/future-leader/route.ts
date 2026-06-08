import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { FutureLeaderCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ candidate: z.string().min(1), evidence: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await FutureLeaderCoach.run({ candidate: b.candidate, evidence: b.evidence });
    const c = out.scores;
    const profile = await prisma.futureLeaderProfile.create({ data: {
      userId, organizationId: b.organizationId ?? null, candidate: b.candidate,
      selfAwareness: c.selfAwareness, decisionQuality: c.decisionQuality, influence: c.influence,
      responsibility: c.responsibility, missionOwnership: c.missionOwnership, identityStability: c.identityStability,
      visionCapability: c.visionCapability, readinessScore: out.readinessScore,
    } });
    return created({ profile, developmentPlan: out.developmentPlan });
  });
}
