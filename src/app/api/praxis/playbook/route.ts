import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [playbooks, blueprints] = await Promise.all([
      prisma.replicationPlaybook.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.businessSystemBlueprint.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ playbooks, blueprints });
  });
}
