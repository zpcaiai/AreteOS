import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { getActivePlan } from "@/lib/naval/plan";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ plan: await getActivePlan(userId) });
  });
}
