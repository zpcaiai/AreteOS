import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { reviewDecisionEntry } from "@/lib/naval/engines";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({
      entryId: z.string().min(1), actualOutcome: z.string().min(1), lessons: z.array(z.string()).optional(),
      biasDetected: z.string().optional(), expectedVsActual: z.number().min(-1).max(1).optional(),
    }));
    return created({ review: await reviewDecisionEntry(userId, b) });
  });
}
