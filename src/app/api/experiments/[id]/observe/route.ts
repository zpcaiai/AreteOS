import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { recordObservation } from "@/lib/experiments";

const ObserveSchema = z.object({
  phase: z.enum(["baseline", "intervention"]),
  value: z.number(),
  at: z.number().int().optional(),
});

// POST /api/experiments/:id/observe -> record a measurement in a phase.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "experiments");
    const { id } = await ctx.params;
    const b = await parseBody(req, ObserveSchema);
    return created(await recordObservation(userId, { experimentId: id, ...b }));
  });
}
