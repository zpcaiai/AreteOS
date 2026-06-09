import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";

const CATS = ["CODE", "MEDIA", "KNOWLEDGE", "PRODUCT", "BRAND", "COMMUNITY", "EQUITY", "INVESTMENT", "BUSINESS", "AI_AGENT"] as const;

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      assetName: z.string().min(1), category: z.enum(CATS).default("KNOWLEDGE"),
      buildSteps: z.array(z.string()).optional(), distribution: z.array(z.string()).optional(),
      maintenance: z.string().optional(), compounding: z.number().min(0).max(1).default(0.5),
    }));
    const plan = await prisma.assetBuildPlan.create({ data: {
      userId, assetName: b.assetName, category: b.category, buildSteps: b.buildSteps ?? [],
      distribution: b.distribution ?? [], maintenance: b.maintenance ?? "", compounding: b.compounding,
    } });
    return created({ plan });
  });
}
