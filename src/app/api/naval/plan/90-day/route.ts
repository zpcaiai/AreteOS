import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { generate90DayPlan, recordSnapshot } from "@/lib/naval/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const [plan] = await Promise.all([generate90DayPlan(userId), recordSnapshot(userId)]);
    return ok({ plan });
  });
}

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ plan: await generate90DayPlan(userId) });
  });
}
