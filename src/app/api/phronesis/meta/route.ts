import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { MetaThinkingCoach } from "@/lib/agents/registry";
import { computeCognitive } from "@/lib/phronesis/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]) }));
    const out = await MetaThinkingCoach.run({ reflections: b.reflections });
    const h = await computeCognitive(userId);
    const profile = await prisma.cognitiveProfile.create({ data: {
      userId, thinkingStyle: out.thinkingStyle, decisionStyle: out.decisionStyle, learningStyle: out.learningStyle,
      reasoningStyle: out.reasoningStyle, riskStyle: out.riskStyle, strengths: out.strengths, weaknesses: out.weaknesses,
      globalScore: h.globalCognitiveScore,
    } });
    return created({ profile });
  });
}
