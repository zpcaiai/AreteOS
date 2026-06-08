import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET() {
  return route(async () => {
    await requireAdmin();
    const products = await prisma.virtualProduct.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return ok({ products });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    await requireAdmin();
    const b = await parseBody(req, z.object({
      slug: z.string().min(1), name: z.string().min(1), description: z.string().default(""),
      kind: z.enum(["MEMBERSHIP_DAYS", "CREDITS", "CONTENT"]),
      price: z.number().min(0),
      grantTier: z.enum(["PLUS", "PRO"]).optional(),
      grantDays: z.number().int().min(0).default(0),
      grantCredits: z.number().int().min(0).default(0),
      grantContentKey: z.string().default(""),
      sortOrder: z.number().int().default(0),
    }));
    const product = await prisma.virtualProduct.create({ data: { ...b, grantTier: b.grantTier ?? null } });
    return created({ product });
  });
}
