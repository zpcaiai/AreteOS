import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { runIdentityReconstruction } from "@/lib/healing/identity";
import { IDENTITY_MODES } from "@/lib/domain/identity-rebuild";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  currentIdentityPain: z.string().min(1),
  relatedFormulationId: z.string().optional(),
  relatedBeliefRecordId: z.string().optional(),
  knownPatterns: z.object({ oldBeliefs: z.array(z.string()).optional(), oldIdentityNarratives: z.array(z.string()).optional(), successfulPracticeEvidence: z.array(z.string()).optional() }).optional(),
  valuesContext: z.object({ importantValues: z.array(z.string()).optional(), relationshipsThatMatter: z.array(z.string()).optional(), workOrCallingThemes: z.array(z.string()).optional(), spiritualContextEnabled: z.boolean().default(false) }).optional(),
  mode: z.enum(IDENTITY_MODES).optional(),
});

// POST /api/identity-reconstruction -> old→transition→new identity + 7-day evidence.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const riskLevel = await latestRiskLevel(userId, b.sessionId);
    if (riskLevel === "red") return NextResponse.json({ error: "Blocked during red risk state.", route: "urgent_crisis_response" }, { status: 409 });
    const result = await runIdentityReconstruction({ userId, ...b, mode: b.mode ?? "identity_mapping", safetyContext: { riskLevel } });
    return ok({ result });
  });
}
