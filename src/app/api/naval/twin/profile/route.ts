import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const twin = await prisma.navalDigitalTwinProfile.findUnique({ where: { userId }, include: { insights: { orderBy: { priority: "desc" }, take: 20 }, memories: { orderBy: { createdAt: "desc" }, take: 20 } } });
    return ok({ twin });
  });
}
