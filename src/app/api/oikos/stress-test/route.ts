import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ResilienceStrategist } from "@/lib/agents/registry";
import { resilienceScore, dependencyRisk } from "@/lib/oikos/scoring";

const s = z.number().min(0).max(1).default(0);

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({
      founderDependency: s, keyPersonDependency: s, customerConcentration: s,
      knowledgeConcentration: s, productConcentration: s,
      context: z.array(z.string()).default([]), scenario: z.string().optional(), organizationId: z.string().optional(),
    }));
    const dims = {
      founderDependency: b.founderDependency, keyPersonDependency: b.keyPersonDependency,
      customerConcentration: b.customerConcentration, knowledgeConcentration: b.knowledgeConcentration,
      productConcentration: b.productConcentration,
    };
    const out = await ResilienceStrategist.run({ context: b.context, scenario: b.scenario });
    const assessment = await prisma.fragilityAssessment.create({ data: {
      userId, organizationId: b.organizationId ?? null, ...dims,
      resilienceScore: resilienceScore(dims),
      fragilityMap: out.patterns as unknown as import("@prisma/client").Prisma.InputJsonValue,
      stressTest: out.stressTest,
    } });
    return created({ assessment, dependencyRisk: dependencyRisk(dims), patterns: out.patterns });
  });
}
