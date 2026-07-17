import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, requireSameOrigin, route } from "@/lib/http";
import { writeSecurityAudit } from "@/lib/security-audit";
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const { id } = await ctx.params;
    await prisma.postComment.delete({ where: { id } });
    await writeSecurityAudit(req, { actorId: adminId, action: "community.comment.delete", targetType: "community_comment", targetId: id });
    return ok({ deleted: id });
  });
}
