import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { getOnboarding, advanceOnboarding } from "@/lib/naval/plan";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok(await getOnboarding(userId));
  });
}

// Mark an onboarding step complete and advance the flow.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ step: z.number().int().min(1).max(11) }));
    return ok(await advanceOnboarding(userId, b.step));
  });
}
