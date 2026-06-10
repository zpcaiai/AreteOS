import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { simulateWhatIf } from "@/lib/whatif";

const pct = z.number().min(0).max(1);
const WhatIfSchema = z.object({
  horizonDays: z.number().int().min(7).max(365).optional(),
  habitConsistency: pct.optional(),
  reflection: pct.optional(),
  decisionQuality: pct.optional(),
  mentalModelUsage: pct.optional(),
  firstPrinciple: pct.optional(),
});

// POST /api/whatif -> deterministic counterfactual projection of the growth score.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, WhatIfSchema);
    const { horizonDays, ...intervention } = b;
    return ok({ simulation: await simulateWhatIf(userId, intervention, horizonDays ?? 90) });
  });
}
