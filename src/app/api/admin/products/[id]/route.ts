import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, parseBody, route } from "@/lib/http";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const b = await parseBody(req, z.object({
      name: z.string().optional(), description: z.string().optional(),
      price: z.number().min(0).optional(), active: z.boolean().optional(), sortOrder: z.number().int().optional(),
    }));
    const product = await prisma.virtualProduct.update({ where: { id }, data: b });
    return ok({ product });
  });
}
