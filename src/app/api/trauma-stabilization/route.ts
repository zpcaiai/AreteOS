import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runTraumaStabilization } from "@/lib/healing/stabilization";
import { STABILIZATION_MODES } from "@/lib/domain/trauma-stabilization";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  currentExperience: z.string().min(1),
  symptoms: z
    .object({
      flashback: z.boolean().optional(), panic: z.boolean().optional(), dissociation: z.boolean().optional(), numbness: z.boolean().optional(),
      intrusiveMemory: z.boolean().optional(), bodyFreeze: z.boolean().optional(), emotionalFlooding: z.boolean().optional(), shutdown: z.boolean().optional(), urgeToEscape: z.boolean().optional(),
    })
    .optional(),
  bodySignals: z.array(z.string()).optional(),
  orientation: z.object({ knowsCurrentDate: z.boolean().optional(), knowsCurrentLocation: z.boolean().optional(), feelsPresent: z.boolean().optional(), feelsSafeEnough: z.boolean().optional() }).optional(),
  preferredStabilizationMode: z.enum(STABILIZATION_MODES).optional(),
});

// POST /api/trauma-stabilization -> stabilization protocol. Red → crisis (409).
// Never asks for trauma details; always blocks deep trauma work.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") {
      return NextResponse.json({ error: "Routed to urgent crisis response.", route: "urgent_crisis_response" }, { status: 409 });
    }
    const result = await runTraumaStabilization({ userId, ...b, safetyContext: { riskLevel } });
    return ok({ result });
  });
}
