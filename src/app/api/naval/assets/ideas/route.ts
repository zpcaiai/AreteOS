import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { generateAssetIdeas } from "@/lib/naval/engines";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ knowledge: z.string().min(1), audience: z.string().optional() }));
    return created(await generateAssetIdeas(userId, b));
  });
}
