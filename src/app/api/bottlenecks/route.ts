import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { diagnoseBottleneck, latestBottleneck } from "@/lib/bottleneck";

const Body = z.object({
  problemStatement: z.string().max(2000).optional(),
  signals: z.array(z.string().max(40)).max(40).optional(),
  useEvidence: z.boolean().optional(),
});

// POST /api/bottlenecks -> diagnose the true growth bottleneck (membership-gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "bottleneck");
    const b = await parseBody(req, Body);
    return ok({ result: await diagnoseBottleneck(userId, b) });
  });
}

// GET /api/bottlenecks -> latest diagnosis (open to any signed-in user).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ latest: await latestBottleneck(userId) });
  });
}
