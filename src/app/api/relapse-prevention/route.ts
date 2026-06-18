import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runRelapsePrevention } from "@/lib/healing/relapse-prevention";
import { RELAPSE_MODES, RelapseSignalsSchema } from "@/lib/domain/relapse-prevention";

const BodySchema = z.object({
  sessionId: z.string().optional(),
  currentConcern: z.string().optional(),
  knownPatterns: z.object({ oldLoops: z.array(z.string()).optional(), coreBeliefs: z.array(z.string()).optional(), avoidanceBehaviors: z.array(z.string()).optional(), emotionalTriggers: z.array(z.string()).optional() }).optional(),
  recentSignals: RelapseSignalsSchema.optional(),
  mode: z.enum(RELAPSE_MODES).optional(),
});

// POST /api/relapse-prevention -> early-warning + if-then + recovery protocols.
// Red → crisis route (409).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = b.sessionId ? await latestRiskLevel(userId, b.sessionId) : "green";
    if (riskLevel === "red") return NextResponse.json({ error: "Routed to urgent crisis response.", route: "urgent_crisis_response" }, { status: 409 });
    const result = await runRelapsePrevention({ userId, ...b, mode: b.mode ?? "create_plan", safetyContext: { riskLevel } });
    return ok({ result });
  });
}
