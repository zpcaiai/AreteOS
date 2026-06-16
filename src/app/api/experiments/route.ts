import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { createExperiment, listExperiments } from "@/lib/experiments";

const CreateSchema = z.object({
  hypothesis: z.string().min(3).max(500),
  metric: z.string().min(1).max(120),
  unit: z.string().max(40).optional(),
  higherIsBetter: z.boolean().optional(),
});

// POST /api/experiments -> create an N-of-1 experiment.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "experiments");
    const b = await parseBody(req, CreateSchema);
    return created(await createExperiment(userId, b));
  });
}

// GET /api/experiments -> list experiments with observation counts.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ experiments: await listExperiments(userId) });
  });
}
