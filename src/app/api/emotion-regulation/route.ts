import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runEmotionRegulation } from "@/lib/healing/emotion-regulation";
import { ER_MODES } from "@/lib/domain/emotion-regulation";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  currentEmotionText: z.string().min(1),
  emotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10) })).optional(),
  bodySignals: z.array(z.string()).optional(),
  urges: z.array(z.string()).optional(),
  context: z.object({ trigger: z.string().optional(), recentSleepHours: z.number().min(0).max(24).optional() }).optional(),
  preferredMode: z.enum(ER_MODES).optional(),
});

// POST /api/emotion-regulation -> DBT/ACT/grounding plan (60s/5m/20m). Red →
// crisis route (409); orange runs stabilization-first.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") {
      return NextResponse.json({ error: "Routed to crisis response during red risk.", route: "urgent_crisis_response" }, { status: 409 });
    }
    const result = await runEmotionRegulation({ userId, ...b, safetyContext: { riskLevel } });
    return ok({ result });
  });
}
