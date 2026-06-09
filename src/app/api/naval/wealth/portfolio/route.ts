import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [profile, assets, income] = await Promise.all([
      prisma.wealthProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.wealthAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.incomeStream.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    const ownershipRatio = profile?.ownershipRatio ?? null;
    return ok({ score: profile?.score ?? null, ownershipRatio, bottleneck: profile?.bottleneck ?? "", assets, income });
  });
}
