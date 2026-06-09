import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const constraints = await prisma.freedomConstraint.findMany({ where: { userId }, orderBy: { severity: "desc" }, take: 50 });
    return ok({ constraints });
  });
}
