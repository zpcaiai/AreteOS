import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const assessments = await prisma.fragilityAssessment.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 });
    return ok({ assessments });
  });
}
