import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, requireSameOrigin, route } from "@/lib/http";
import { writeSecurityAudit } from "@/lib/security-audit";
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const { id } = await ctx.params;
    await prisma.communityPost.delete({ where: { id } }); // cascades comments
    await writeSecurityAudit(req, { actorId: adminId, action: "community.post.delete", targetType: "community_post", targetId: id });
    return ok({ deleted: id });
  });
}
