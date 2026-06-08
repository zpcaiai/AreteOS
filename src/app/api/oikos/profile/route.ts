import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [profile, assessment] = await Promise.all([
      prisma.managementProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.managementAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ profile, assessment });
  });
}
