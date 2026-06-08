import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, route } from "@/lib/http";
export async function GET() {
  return route(async () => {
    await requireAdmin();
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" }, take: 100,
      include: {
        user: { select: { email: true, name: true } },
        comments: { orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { email: true } } } },
        _count: { select: { comments: true } },
      },
    });
    return ok({ posts });
  });
}
