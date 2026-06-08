import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { BelongingCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ signals: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await BelongingCoach.run({ signals: b.signals });
    const c = out.scores;
    const assessment = await prisma.belongingAssessment.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      trust: c.trust, psychologicalSafety: c.psychologicalSafety, recognition: c.recognition,
      contribution: c.contribution, identityFit: c.identityFit, missionFit: c.missionFit,
      belongingScore: out.belongingScore, cohesionScore: out.cohesionScore,
    } });
    return created({ assessment, moves: out.moves });
  });
}
