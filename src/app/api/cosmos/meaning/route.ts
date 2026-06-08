import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { MeaningGuide } from "@/lib/agents/registry";
import { meaningScore } from "@/lib/cosmos/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]) }));
    const out = await MeaningGuide.run({ reflections: b.reflections });
    const c = out.scores;
    const profile = await prisma.meaningProfile.create({ data: {
      userId, work: c.work, learning: c.learning, relationships: c.relationships, contribution: c.contribution,
      mastery: c.mastery, legacy: c.legacy, meaningScore: meaningScore(c), summary: out.summary,
    } });
    return created({ profile, suggestions: out.suggestions });
  });
}
