import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { crossEngineInsights } from "@/lib/cross-engine-service";
import { track } from "@/lib/telemetry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cross_engine");
    const result = await crossEngineInsights(userId);
    await track({ userId, name: "engine_run", props: { engine: "cross_engine", insights: result.insights.length } });
    return ok(result);
  });
}
