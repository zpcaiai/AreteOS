import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { DecisionLensAnalyzer } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ decision: z.string().min(1), context: z.string().optional() }));
    const out = await DecisionLensAnalyzer.run({ decision: b.decision, context: b.context });
    const result = await prisma.decisionLensResult.create({ data: {
      userId, decision: b.decision, confidence: out.confidence,
      lenses: { lenses: out.lenses, recommendation: out.recommendation } as unknown as import("@prisma/client").Prisma.InputJsonValue,
    } });
    return created({ result, analysis: out });
  });
}
