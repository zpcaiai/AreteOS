import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { runHealingTimeline } from "@/lib/healing/healing-timeline";

const BodySchema = z.object({
  timeRange: z.object({ from: z.string(), to: z.string() }).optional(),
  reportMode: z.enum(["daily", "weekly", "monthly", "full_journey", "pattern_analysis"]).default("weekly"),
});

// POST /api/healing-timeline -> aggregate the healing journey into a progress
// report. No risk gate (read-only); range defaults to the last 30 days.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const to = b.timeRange?.to ?? new Date().toISOString();
    const from = b.timeRange?.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = await runHealingTimeline({ userId, timeRange: { from, to }, reportMode: b.reportMode });
    return ok({ result });
  });
}
