import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";

const CATS = ["CODE", "MEDIA", "KNOWLEDGE", "PRODUCT", "BRAND", "COMMUNITY", "EQUITY", "INVESTMENT", "BUSINESS", "AI_AGENT"] as const;

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const assets = await prisma.wealthAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return ok({ assets });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      name: z.string().min(1), category: z.enum(CATS).default("KNOWLEDGE"),
      ownership: z.number().min(0).max(1).default(1), leverage: z.number().min(0).max(1).default(0),
      compounding: z.number().min(0).max(1).default(0), durability: z.number().min(0).max(1).default(0.5),
    }));
    const asset = await prisma.wealthAsset.create({ data: { userId, ...b } });
    return created({ asset });
  });
}
