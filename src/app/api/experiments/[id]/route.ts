import { getUserId } from "@/lib/auth";
import { notFound, ok, route } from "@/lib/http";
import { getExperimentReadout } from "@/lib/experiments";

// GET /api/experiments/:id -> baseline vs intervention causal readout.
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const result = await getExperimentReadout(userId, id);
    return result ? ok({ experiment: result }) : notFound("Experiment not found");
  });
}
