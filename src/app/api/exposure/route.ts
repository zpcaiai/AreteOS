import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runExposureEngine } from "@/lib/healing/exposure";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  avoidanceProblem: z.string().min(1),
  relatedCBTSessionId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  relatedFormulationId: z.string().optional(),
  fearPrediction: z.string().optional(),
  targetBehavior: z.string().optional(),
  currentAvoidanceBehaviors: z.array(z.string()).optional(),
  safetyBehaviors: z.array(z.string()).optional(),
  distressRating: z.number().min(0).max(10).optional(),
});

// POST /api/exposure -> avoidance loop + graded ladder + first experiment.
// Exposure requires green/yellow: red AND orange both block (orange → stabilization).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") return NextResponse.json({ error: "Blocked during red risk state.", route: "urgent_crisis_response" }, { status: 409 });
    if (riskLevel === "orange") return NextResponse.json({ error: "Exposure is not available during orange risk state.", route: "stabilization" }, { status: 409 });
    const result = await runExposureEngine({ userId, ...b, safetyContext: { riskLevel } });
    return ok({ result });
  });
}
