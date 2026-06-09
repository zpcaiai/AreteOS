import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const stacks = await prisma.talentStack.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { signals: true }, take: 10 });
    return ok({ stacks });
  });
}
