import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const plans = await prisma.assetBuildPlan.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return ok({ plans });
  });
}
