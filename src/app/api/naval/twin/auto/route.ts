import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { collectTwinSignals, getActiveGoal } from "@/lib/naval/plan";
import { synthesizeTwin } from "@/lib/naval/engines";

// Auto-collect signals from every engine, write them to twin memory, then
// synthesize the twin — no manual signal entry required.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ goal: z.string().optional() }));
    const signals = await collectTwinSignals(userId);
    const goal = b.goal || (await getActiveGoal(userId))?.statement || "";
    const result = await synthesizeTwin(userId, { signals, goal });
    return created({ ...result, collectedSignals: signals });
  });
}
