import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { OperatingPrincipleBuilder } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      values: z.array(z.string()).default([]), decisionRules: z.array(z.string()).default([]),
      organizationId: z.string().optional(),
    }));
    const out = await OperatingPrincipleBuilder.run({ values: body.values, decisionRules: body.decisionRules });
    const principles = await prisma.$transaction(out.principles.map((p) =>
      prisma.operatingPrinciple.create({ data: {
        userId, organizationId: body.organizationId ?? null, principle: p.principle, whyItMatters: p.whyItMatters,
        decisionContext: p.decisionContext, examples: p.examples, antiPatterns: p.antiPatterns, enforcement: p.enforcement,
      } })));
    return created({ principles });
  });
}
