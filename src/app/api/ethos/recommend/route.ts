import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { IdentityRecommendationAgent } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      mission: z.string().optional(), values: z.array(z.string()).default([]),
      goals: z.array(z.string()).default([]), strengths: z.array(z.string()).default([]), desiredFuture: z.string().optional(),
    }));
    const out = await IdentityRecommendationAgent.run(b);
    const recommendations = await prisma.$transaction(out.recommendations.map((r) =>
      prisma.identityRecommendation.create({ data: {
        userId, archetypeSlug: r.archetype.toLowerCase().replace(/\s+/g, "-"), archetypeName: r.archetype,
        role: r.role, rationale: r.rationale, fitScore: r.fitScore,
      } })));
    return created({ recommendations, growthPath: out.growthPath });
  });
}
