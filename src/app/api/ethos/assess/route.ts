import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { IdentityAssessor } from "@/lib/agents/registry";
import { globalIdentityScore } from "@/lib/ethos/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]), mission: z.string().optional() }));
    const out = await IdentityAssessor.run({ reflections: b.reflections, mission: b.mission });
    const c = out.scores;
    const globalScore = globalIdentityScore(c);
    const assessment = await prisma.identityAssessment.create({ data: {
      userId, clarity: c.clarity, alignment: c.alignment, stability: c.stability,
      conflict: c.conflict, evolution: c.evolution, integration: c.integration, globalScore, summary: out.summary,
    } });
    return created({ assessment });
  });
}
