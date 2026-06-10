import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeGraphInsights } from "@/lib/graph-insights";

// GET /api/graph/insights -> latticework recommendations, category gaps, value tensions.
// Uses Neo4j traversals when configured; falls back to PostgreSQL automatically.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ insights: await computeGraphInsights(userId) });
  });
}
