import { requireAdmin } from "@/lib/admin/auth";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { refundAndRevokeStoreOrder } from "@/lib/emporion/service";
import { z } from "zod";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody(req, z.object({ reason: z.string().trim().min(3).max(256) }));
    const order = await refundAndRevokeStoreOrder(id, body.reason);
    await writeSecurityAudit(req, { actorId: adminId, action: "order.refund", targetType: "order", targetId: id, metadata: { reason: body.reason } });
    return ok({ order });
  });
}
