import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const games = await prisma.longTermGame.findMany({ where: { userId }, orderBy: { score: "desc" }, take: 50 });
    return ok({ games });
  });
}
