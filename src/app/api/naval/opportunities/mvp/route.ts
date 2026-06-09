import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ opportunityId: z.string().min(1), mvp: z.string().min(1) }));
    const opp = await prisma.startupOpportunity.findFirst({ where: { id: b.opportunityId, userId } });
    if (!opp) return ok({ error: "Opportunity not found" }, { status: 404 });
    const updated = await prisma.startupOpportunity.update({ where: { id: opp.id }, data: { mvp: b.mvp, status: "IN_PROGRESS" } });
    return ok({ opportunity: updated });
  });
}
