import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ManagementArchitect } from "@/lib/agents/registry";
import { managementMaturityScore } from "@/lib/oikos/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await ManagementArchitect.run({ reflections: b.reflections });
    const c = out.scores;
    const maturityScore = managementMaturityScore(c);
    const assessment = await prisma.managementAssessment.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      mission: c.mission, leadership: c.leadership, knowledge: c.knowledge, decisionQuality: c.decisionQuality,
      delegation: c.delegation, alignment: c.alignment, resilience: c.resilience, maturityScore,
    } });
    await prisma.managementProfile.create({ data: {
      userId, organizationId: b.organizationId ?? null, level: out.level, maturityScore,
    } });
    return created({ assessment, level: out.level, roadmap: out.roadmap });
  });
}
