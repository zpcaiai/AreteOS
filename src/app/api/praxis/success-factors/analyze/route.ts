import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { SuccessFactorModeler } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      founderProfile: z.string().optional(), history: z.array(z.string()).default([]),
      wins: z.array(z.string()).default([]), organizationId: z.string().optional(),
    }));
    const out = await SuccessFactorModeler.run(body);
    const created_ = await prisma.$transaction(out.factors.map((f) =>
      prisma.successFactor.create({ data: {
        userId, organizationId: body.organizationId ?? null, name: f.name, description: f.description,
        category: f.category, evidence: f.evidence, repeatabilityScore: f.repeatabilityScore,
        founderDependencyScore: f.founderDependencyScore, scalabilityScore: f.scalabilityScore,
        riskIfLost: f.riskIfLost, replicationMethod: f.replicationMethod,
      } })));
    return created({ factors: created_ });
  });
}
