import { prisma } from "@/lib/db";
import { ok, notFound, route } from "@/lib/http";
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const { id } = await ctx.params;
    const model = await prisma.cogModel.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!model) return notFound("Mental model not found");
    const related = await prisma.cogModelRelationship.findMany({ where: { fromSlug: model.slug } });
    return ok({ model, related });
  });
}
