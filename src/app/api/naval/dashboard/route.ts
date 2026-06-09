import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeNavalDashboard, snapshotTrend } from "@/lib/naval/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [dashboard, trend] = await Promise.all([computeNavalDashboard(userId), snapshotTrend(userId)]);
    return ok({ dashboard, trend });
  });
}
