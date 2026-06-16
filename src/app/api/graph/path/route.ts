import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { graphPathInsights } from "@/lib/graph-path";

// GET /api/graph/path?from=Compounding&to=Margin+of+Safety -> shortest learning
// path through the latticework + emergent (predicted) connections + central models.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "graph_path");
    const url = new URL(req.url);
    const from = url.searchParams.get("from") ?? undefined;
    const to = url.searchParams.get("to") ?? undefined;
    const limit = Number(url.searchParams.get("limit") ?? "8") || 8;
    return ok({ graph: await graphPathInsights(userId, { from, to, limit }) });
  });
}
