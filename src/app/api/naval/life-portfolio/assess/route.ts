import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { assessLifePortfolio } from "@/lib/naval/engines";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      areas: z.array(z.object({ area: z.string(), current: z.number().min(0).max(1) })).min(1),
      context: z.string().optional(),
    }));
    return created(await assessLifePortfolio(userId, b));
  });
}
