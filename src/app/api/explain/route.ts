import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeScoresCached } from "@/lib/analytics";
import { scoresToFactors } from "@/lib/future-self";
import { explainGrowth } from "@/lib/explain";

// GET /api/explain -> a transparent breakdown of the Growth Score: which layers
// drag it down and which single layer would move it most if raised.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const { scores } = await computeScoresCached(userId);
    return ok({ explanation: explainGrowth(scoresToFactors(scores)) });
  });
}
