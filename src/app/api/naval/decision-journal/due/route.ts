import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { dueDecisionReviews } from "@/lib/naval/plan";

// Decisions whose review date has arrived and that haven't been reviewed yet.
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ due: await dueDecisionReviews(userId) });
  });
}
