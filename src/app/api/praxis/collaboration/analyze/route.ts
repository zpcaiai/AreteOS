import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { CollaborationPatternAnalyzer } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({ observations: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await CollaborationPatternAnalyzer.run({ observations: body.observations });
    const patterns = await prisma.$transaction(out.patterns.map((p) =>
      prisma.collaborationPattern.create({ data: {
        userId, organizationId: body.organizationId ?? null, dimension: p.dimension, score: p.score, friction: p.friction, upgrade: p.upgrade,
      } })));
    return created({ patterns, overall: out.overall });
  });
}
