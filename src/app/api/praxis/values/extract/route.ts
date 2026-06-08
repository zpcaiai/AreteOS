import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { BusinessValueArchitect } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      founderValues: z.array(z.string()).default([]), behaviors: z.array(z.string()).default([]),
      organizationId: z.string().optional(),
    }));
    const out = await BusinessValueArchitect.run(body);
    const values = await prisma.$transaction(out.values.map((v) =>
      prisma.coreBusinessValue.create({ data: {
        userId, organizationId: body.organizationId ?? null, value: v.value, rank: v.rank,
        operatingPrinciple: v.operatingPrinciple, dilutionRisk: v.dilutionRisk,
      } })));
    return created({ values, conflicts: out.conflicts });
  });
}
