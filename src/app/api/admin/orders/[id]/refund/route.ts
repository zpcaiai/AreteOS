import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, notFound, route } from "@/lib/http";
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const order = await prisma.storeOrder.findUnique({ where: { id } });
    if (!order) return notFound("订单不存在");
    const updated = await prisma.storeOrder.update({
      where: { id },
      data: { status: "CANCELLED", deliveryNote: (order.deliveryNote ? order.deliveryNote + " · " : "") + "管理员已退款/取消" },
    });
    return ok({ order: updated });
  });
}
