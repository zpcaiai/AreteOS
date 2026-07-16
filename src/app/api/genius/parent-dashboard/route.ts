import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route, HttpError } from "@/lib/http";
import { computeChild } from "@/lib/genius/service";
import { requireGuardianConsent } from "@/lib/guardian-consent";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireGuardianConsent(userId);
    const childId = new URL(req.url).searchParams.get("childId") ?? "";
    const child = await prisma.childProfile.findFirst({ where: { id: childId, userId } });
    if (!child) throw new HttpError(404, "Child not found");
    const [health, env, coaching] = await Promise.all([
      computeChild(childId),
      prisma.learningEnvironment.findFirst({ where: { childId }, orderBy: { createdAt: "desc" } }),
      prisma.parentCoachingSession.findMany({ where: { childId }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    return ok({ child, health, environment: env, coaching });
  });
}
