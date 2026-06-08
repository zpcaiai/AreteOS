import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { BiasDetector } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ reasoning: z.string().min(1) }));
    const out = await BiasDetector.run({ reasoning: b.reasoning });
    const events = await prisma.$transaction(out.biases.map((x) =>
      prisma.biasEvent.create({ data: {
        userId, biasSlug: x.bias.toLowerCase().replace(/\s+/g, "-"), biasName: x.bias, context: x.evidence, severity: x.severity,
      } })));
    return created({ events, biases: out.biases, riskScore: out.riskScore });
  });
}
