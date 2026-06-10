import { getUserId } from "@/lib/auth";
import { created, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { saveCurrentPlan } from "@/lib/naval/plan";
import { recordSnapshot } from "@/lib/naval/service";

// Generate a 90-day plan, persist it (archiving the prior active plan), and
// record a score snapshot for the trend line.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const [plan] = await Promise.all([saveCurrentPlan(userId), recordSnapshot(userId)]);
    return created({ plan });
  });
}
