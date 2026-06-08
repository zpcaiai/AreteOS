import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ConsciousLeadershipCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await ConsciousLeadershipCoach.run({ reflections: body.reflections });
    const pattern = await prisma.leadershipPattern.create({ data: {
      userId, organizationId: body.organizationId ?? null,
      pattern: out.growthPlan.join(" · ") || "leadership assessment",
      maturityScore: out.maturityScore, blindSpots: out.blindSpots,
    } });
    return created({ pattern, analysis: out });
  });
}
