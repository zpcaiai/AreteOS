import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { computeEvidenceGaps, EVIDENCE_KINDS, ingestEvidence } from "@/lib/evidence";

const SignalSchema = z.object({
  source: z.string().min(1).max(40),
  kind: z.enum(EVIDENCE_KINDS),
  value: z.number().min(0).max(1),
  at: z.number().int().optional(),
});
const IngestSchema = z.object({ signals: z.array(SignalSchema).min(1).max(500) });

// POST /api/evidence -> ingest behavioral signals (stored as domain events).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "evidence");
    const { signals } = await parseBody(req, IngestSchema);
    const normalized = signals.map((s) => ({ ...s, at: s.at ?? Date.now() }));
    return ok(await ingestEvidence(userId, normalized));
  });
}

// GET /api/evidence -> identity-behavior gap report (stated vs enacted).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "evidence");
    const url = new URL(req.url);
    const sinceDays = Number(url.searchParams.get("sinceDays") ?? "90") || 90;
    const halfLifeDays = Number(url.searchParams.get("halfLifeDays") ?? "21") || 21;
    const withInterpretation = url.searchParams.get("interpret") === "1";
    return ok({ evidence: await computeEvidenceGaps(userId, { sinceDays, halfLifeDays, withInterpretation }) });
  });
}
