import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { childAssessmentScore } from "@/lib/genius/scoring";

const s = z.number().min(0).max(1).default(0);

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const childId = new URL(req.url).searchParams.get("childId") ?? "";
    if (!(await prisma.childProfile.findFirst({ where: { id: childId, userId } }))) throw new HttpError(404, "Child not found");
    const assessments = await prisma.childAssessment.findMany({ where: { childId }, orderBy: { createdAt: "desc" }, take: 30 });
    return ok({ assessments });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({
      childId: z.string().min(1), curiosity: s, creativity: s, resilience: s, autonomy: s,
      collaboration: s, problemSolving: s, identityClarity: s, learningMotivation: s,
    }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const { childId, ...dims } = b;
    const globalScore = childAssessmentScore(dims);
    const assessment = await prisma.childAssessment.create({ data: { childId, ...dims, globalScore } });
    return created({ assessment });
  });
}
