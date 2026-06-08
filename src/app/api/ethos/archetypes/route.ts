import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const url = new URL(req.url);
    const family = url.searchParams.get("family");
    const archetypes = await prisma.identityArchetype.findMany({
      where: family ? { family: { slug: family } } : undefined,
      orderBy: { name: "asc" },
      include: { family: { select: { slug: true, name: true } } },
    });
    return ok({ archetypes });
  });
}
