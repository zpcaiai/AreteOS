import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ResilienceStrategist } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({ context: z.array(z.string()).default([]), scenario: z.string().optional(), organizationId: z.string().optional() }));
    const out = await ResilienceStrategist.run({ context: body.context, scenario: body.scenario });
    const patterns = await prisma.$transaction(out.patterns.map((p) =>
      prisma.resiliencePattern.create({ data: {
        userId, organizationId: body.organizationId ?? null, dimension: p.dimension, score: p.score, fragility: p.fragility, upgrade: p.upgrade,
      } })));
    return created({ patterns, overall: out.overall, stressTest: out.stressTest });
  });
}
