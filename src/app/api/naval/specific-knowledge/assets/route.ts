import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { addSpecificKnowledgeAsset } from "@/lib/naval/engines";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const assets = await prisma.specificKnowledgeAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return ok({ assets });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      name: z.string().min(1), description: z.string().optional(), evidence: z.array(z.string()).optional(),
      profileId: z.string().optional(), rarity: z.number().min(0).max(1).optional(), relevance: z.number().min(0).max(1).optional(),
    }));
    return created({ asset: await addSpecificKnowledgeAsset(userId, b) });
  });
}
