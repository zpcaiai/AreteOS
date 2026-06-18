import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runCoreBeliefReconstruction } from "@/lib/healing/core-belief";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  problemStatement: z.string().min(1),
  formulationId: z.string().optional(),
  intakeId: z.string().optional(),
  diltsContext: z
    .object({ behaviors: z.array(z.string()).optional(), beliefs: z.array(z.string()).optional(), identities: z.array(z.string()).optional() })
    .optional(),
  preferences: z.object({ depth: z.enum(["light", "standard", "deep"]).default("standard"), language: z.enum(["zh", "en"]).default("zh") }).optional(),
});

// POST /api/core-belief -> extract + reconstruct beliefs. Red blocks (409);
// orange runs shallow. Risk read server-side from the latest triage.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") {
      return NextResponse.json({ error: "Blocked during red risk state.", route: "urgent_crisis_response" }, { status: 409 });
    }
    const result = await runCoreBeliefReconstruction({ userId, ...b, safetyContext: { riskLevel } });
    return ok({ result });
  });
}
