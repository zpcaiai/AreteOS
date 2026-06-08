import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";
export async function GET() {
  return route(async () => {
    const archetypes = await prisma.worldviewArchetype.findMany({ orderBy: { name: "asc" } });
    return ok({ archetypes });
  });
}
