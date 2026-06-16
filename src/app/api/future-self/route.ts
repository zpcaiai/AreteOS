import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { projectFutureSelf } from "@/lib/future-self";

const pct = z.number().min(0).max(1);
const FutureSelfSchema = z.object({
  horizonMonths: z.number().int().min(1).max(120).optional(),
  runs: z.number().int().min(100).max(20000).optional(),
  volatility: z.number().min(0).max(0.5).optional(),
  threshold: pct.optional(),
  withLetter: z.boolean().optional(),
  policy: z
    .object({
      habits: pct.optional(),
      reflection: pct.optional(),
      decisions: pct.optional(),
      mentalModels: pct.optional(),
      firstPrinciples: pct.optional(),
    })
    .optional(),
});

// POST /api/future-self -> Monte Carlo distribution of your growth trajectory +
// optional grounded letter from your future self.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "future_self");
    const b = await parseBody(req, FutureSelfSchema);
    return ok({ futureSelf: await projectFutureSelf(userId, b) });
  });
}
