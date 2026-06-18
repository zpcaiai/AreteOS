import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runCBT } from "@/lib/healing/cbt";
import { CBT_MODES } from "@/lib/domain/cbt";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  situation: z.string().min(1),
  relatedBeliefRecordId: z.string().optional(),
  formulationId: z.string().optional(),
  currentState: z
    .object({
      emotions: z.array(z.object({ name: z.string(), intensity: z.number().min(0).max(10) })).optional(),
      urges: z.array(z.string()).optional(),
      currentBehavior: z.string().optional(),
    })
    .optional(),
  mode: z.enum(CBT_MODES).optional(),
});

// POST /api/cbt -> CBT map + distortions + evidence + alternatives + behavior plan.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") {
      return NextResponse.json({ error: "Blocked during red risk state.", route: "urgent_crisis_response" }, { status: 409 });
    }
    const result = await runCBT({ userId, ...b, mode: b.mode ?? "thought_record", safetyContext: { riskLevel } });
    return ok({ result });
  });
}
