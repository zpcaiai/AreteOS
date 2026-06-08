import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const factors = await prisma.successFactor.findMany({ where: { userId }, orderBy: { scalabilityScore: "desc" } });
    return ok({ factors });
  });
}
