import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [profile, leverage] = await Promise.all([
      prisma.leadershipProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.leadershipLeverageMap.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ profile, leverage });
  });
}
