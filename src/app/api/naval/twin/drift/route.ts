import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const twin = await prisma.navalDigitalTwinProfile.findUnique({ where: { userId } });
    const driftInsights = twin ? await prisma.navalTwinInsight.findMany({ where: { twinId: twin.id, kind: "drift" }, orderBy: { createdAt: "desc" }, take: 5 }) : [];
    return ok({ driftScore: twin?.driftScore ?? 0, driftInsights });
  });
}
