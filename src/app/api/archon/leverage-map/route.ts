import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { LeadershipLeverageAnalyzer } from "@/lib/agents/registry";
import { leverageScore } from "@/lib/archon/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ inputs: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await LeadershipLeverageAnalyzer.run({ inputs: b.inputs });
    const d = out.distribution;
    const score = leverageScore(d);
    const map = await prisma.leadershipLeverageMap.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      environment: d.environment, behavior: d.behavior, capability: d.capability,
      belief: d.belief, identity: d.identity, mission: d.mission,
      overfocus: out.overfocus, blindSpots: out.blindSpots, leverageScore: score,
    } });
    await prisma.leadershipProfile.create({ data: {
      userId, organizationId: b.organizationId ?? null, leverageScore: score, blindSpots: out.blindSpots,
    } });
    return created({ map, leverageScore: score });
  });
}
