import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { setGoal, getActiveGoal } from "@/lib/naval/plan";
import { NavalGoalSchema } from "@/lib/schemas";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ goal: await getActiveGoal(userId) });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, NavalGoalSchema);
    return created({ goal: await setGoal(userId, b) });
  });
}
