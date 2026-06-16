import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { journeyOverview } from "@/lib/journey";

// GET /api/journey -> cross-engine overview (open to any signed-in user).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ journey: await journeyOverview(userId) });
  });
}
