import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { leadershipMaturityScore } from "@/lib/archon/scoring";

const s = z.number().min(0).max(1).default(0);

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({
      selfAwareness: s, responsibility: s, communication: s, emotionalRegulation: s,
      decisionMaturity: s, integrity: s, peopleDevelopment: s, organizationId: z.string().optional(),
    }));
    const maturityScore = leadershipMaturityScore(b);
    const assessment = await prisma.leadershipAssessment.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      selfAwareness: b.selfAwareness, responsibility: b.responsibility, communication: b.communication,
      emotionalRegulation: b.emotionalRegulation, decisionMaturity: b.decisionMaturity, integrity: b.integrity,
      peopleDevelopment: b.peopleDevelopment, maturityScore,
    } });
    return created({ assessment });
  });
}
