import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";
export async function GET() {
  return route(async () => {
    const families = await prisma.identityFamily.findMany({
      orderBy: { sortOrder: "asc" },
      include: { archetypes: { orderBy: { name: "asc" }, select: { id: true, slug: true, name: true, identityStatement: true } } },
    });
    return ok({ families });
  });
}
