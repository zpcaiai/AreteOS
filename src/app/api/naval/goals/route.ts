import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { setGoal, getActiveGoal } from "@/lib/naval/plan";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ goal: await getActiveGoal(userId) });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      statement: z.string().min(1),
      horizon: z.enum(["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"]).optional(),
      why: z.string().optional(),
      targetDate: z.string().optional(),
    }));
    return created({ goal: await setGoal(userId, b) });
  });
}
