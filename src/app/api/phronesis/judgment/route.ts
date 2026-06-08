import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { JudgmentCoach } from "@/lib/agents/registry";
import { judgmentScore } from "@/lib/phronesis/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]) }));
    const out = await JudgmentCoach.run({ reflections: b.reflections });
    const c = out.scores;
    const score = judgmentScore(c);
    const assessment = await prisma.judgmentAssessment.create({ data: {
      userId, problemFraming: c.problemFraming, evidenceQuality: c.evidenceQuality, modelDiversity: c.modelDiversity,
      biasResistance: c.biasResistance, longTermThinking: c.longTermThinking, secondOrderThinking: c.secondOrderThinking,
      riskAwareness: c.riskAwareness, decisionClarity: c.decisionClarity, judgmentScore: score,
    } });
    await prisma.judgmentProfile.create({ data: { userId, judgmentScore: score, blindSpots: out.developmentPlan } });
    return created({ assessment, developmentPlan: out.developmentPlan });
  });
}
