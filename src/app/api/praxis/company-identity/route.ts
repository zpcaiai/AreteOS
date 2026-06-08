import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const identity = await prisma.companyIdentity.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } });
    return ok({ identity });
  });
}
