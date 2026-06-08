import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    await requireAdmin();
    const q = new URL(req.url).searchParams.get("q")?.trim();
    const users = await prisma.user.findMany({
      where: q ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: { createdAt: "desc" }, take: 100,
      select: { id: true, email: true, name: true, createdAt: true, membership: { select: { tier: true, expiresAt: true } } },
    });
    return ok({ users });
  });
}
