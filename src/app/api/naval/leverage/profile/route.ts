import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const profile = await prisma.leverageProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { sources: true } });
    return ok({ profile });
  });
}
