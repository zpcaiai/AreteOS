import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { DecisionRuleEncoder } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({ decisions: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await DecisionRuleEncoder.run({ decisions: body.decisions });
    const rules = await prisma.$transaction(out.rules.map((r) =>
      prisma.businessDecisionRule.create({ data: {
        userId, organizationId: body.organizationId ?? null, rule: r.rule, context: r.context,
        examples: r.examples, antiPatterns: r.antiPatterns,
      } })));
    return created({ rules });
  });
}
