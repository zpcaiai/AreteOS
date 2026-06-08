import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, route } from "@/lib/http";
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await prisma.postComment.delete({ where: { id } });
    return ok({ deleted: id });
  });
}
