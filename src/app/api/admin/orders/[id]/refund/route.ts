import { requireAdmin } from "@/lib/admin/auth";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { refundAndRevokeStoreOrder } from "@/lib/emporion/service";
import { z } from "zod";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await parseBody(req, z.object({ reason: z.string().trim().min(3).max(256) }));
    return ok({ order: await refundAndRevokeStoreOrder(id, body.reason) });
  });
}
