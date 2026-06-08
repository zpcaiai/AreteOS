import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    await requireAdmin();
    const status = new URL(req.url).searchParams.get("status") || undefined;
    const orders = await prisma.storeOrder.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" }, take: 100,
    });
    return ok({ orders });
  });
}
