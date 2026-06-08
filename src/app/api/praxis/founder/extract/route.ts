import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { FounderPatternExtractor } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      answers: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
      companyStory: z.string().optional(), organizationId: z.string().optional(),
    }));
    const out = await FounderPatternExtractor.run({ answers: body.answers, companyStory: body.companyStory });
    const profile = await prisma.founderProfile.create({
      data: {
        userId, organizationId: body.organizationId ?? null,
        founderIdentity: out.founderIdentity, founderValues: out.founderValues, founderBeliefs: out.founderBeliefs,
        decisionStyle: out.decisionStyle, riskStyle: out.riskStyle, learningStyle: out.learningStyle,
        leadershipStyle: out.leadershipStyle, creativityStyle: out.creativityStyle, executionStyle: out.executionStyle,
        strengths: out.strengths, shadowRisks: out.shadowRisks,
        dependencyMap: out.dependencyMap as unknown as import("@prisma/client").Prisma.InputJsonValue,
      },
    });
    return created({ profile, analysis: out });
  });
}
