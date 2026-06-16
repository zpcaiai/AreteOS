import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { buildGrowthNarrative } from "@/lib/narrative";

const NarrativeSchema = z.object({
  periodDays: z.number().int().min(7).max(1825).optional(),
  withProse: z.boolean().optional(),
});

// POST /api/narrative -> structured growth signals + (optional) the narrative of
// who you are becoming, generated from your own event-sourced history.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "narrative");
    const b = await parseBody(req, NarrativeSchema);
    return ok({ narrative: await buildGrowthNarrative(userId, b) });
  });
}
