import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { AlignmentAnalyst } from "@/lib/agents/registry";
import { alignmentScore } from "@/lib/archon/scoring";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const assessment = await prisma.alignmentAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    return ok({ assessment, score: assessment ? alignmentScore(assessment) : 0 });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ inputs: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await AlignmentAnalyst.run({ inputs: b.inputs });
    const c = out.scores;
    const assessment = await prisma.alignmentAssessment.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      mission: c.mission, identity: c.identity, values: c.values, decisionRules: c.decisionRules,
      behaviors: c.behaviors, teams: c.teams, alignmentScore: alignmentScore(c), misalignments: out.misalignments,
    } });
    return created({ assessment });
  });
}
