import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { getDashboard, recordSession, reviewSession } from "@/lib/deep-work";

const pct = z.number().min(0).max(1);
const Body = z.object({
  action: z.enum(["session", "review"]),
  durationMin: z.number().min(1).max(600),
  distractions: z.number().int().min(0).max(500),
  difficulty: pct,
  outputQuality: pct,
  notes: z.string().max(1000).optional(),
});

// GET /api/deep-work -> dashboard + 28-day heatmap (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ dashboard: await getDashboard(userId) });
  });
}

// POST /api/deep-work -> save a finished session or review one (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "skill_deep_work");
    const b = await parseBody(req, Body);
    if (b.action === "review") return ok({ review: await reviewSession(b) });
    await recordSession(userId, b);
    return ok({ dashboard: await getDashboard(userId), review: await reviewSession(b) });
  });
}
