import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ManagementCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ context: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await ManagementCoach.run({ context: b.context });
    const session = await prisma.coachingSession.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      blindSpots: out.blindSpots, growthAreas: out.growthAreas, coachingPlan: out.coachingPlan, developmentPlan: out.developmentPlan,
    } });
    return created({ session });
  });
}
