import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { togglePlanTask } from "@/lib/naval/plan";

// Toggle a plan task done/undone; returns recomputed plan progress.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ taskId: z.string().min(1), done: z.boolean() }));
    return ok(await togglePlanTask(userId, b.taskId, b.done));
  });
}
