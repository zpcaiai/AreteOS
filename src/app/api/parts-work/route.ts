import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runPartsWork } from "@/lib/healing/parts-work";
import { PARTS_MODES } from "@/lib/domain/parts-work";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  currentConflict: z.string().min(1),
  relatedFormulationId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  knownPatterns: z.object({ coreBeliefs: z.array(z.string()).optional(), identityNarratives: z.array(z.string()).optional(), behaviors: z.array(z.string()).optional(), emotions: z.array(z.string()).optional() }).optional(),
  mode: z.enum(PARTS_MODES).optional(),
});

// POST /api/parts-work -> inner parts map + Healthy Adult response. Red blocks
// (409); orange → light check-in only.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") {
      return NextResponse.json({ error: "Blocked during red risk state.", route: "urgent_crisis_response" }, { status: 409 });
    }
    const result = await runPartsWork({ userId, ...b, mode: b.mode ?? "parts_mapping", safetyContext: { riskLevel } });
    return ok({ result });
  });
}
