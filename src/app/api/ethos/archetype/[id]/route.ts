import { prisma } from "@/lib/db";
import { ok, notFound, route } from "@/lib/http";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const { id } = await ctx.params;
    const archetype = await prisma.identityArchetype.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { family: true },
    });
    if (!archetype) return notFound("Identity archetype not found");
    return ok({ archetype });
  });
}
