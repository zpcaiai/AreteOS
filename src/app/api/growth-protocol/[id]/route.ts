import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { badRequest, notFound, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { getRun, orchestrateCompound, orchestrateDesign, orchestrateDiagnose, orchestratePractice, recordStage, runFullLoop } from "@/lib/growth-protocol";
import { PROTOCOL_STAGES } from "@/lib/protocol-scoring";

const pct = z.number().min(0).max(1);
const Body = z.object({
  action: z.enum(["record", "diagnose", "design", "practice", "compound", "full-loop"]).default("record"),
  stage: z.enum(PROTOCOL_STAGES).optional(),
  score: pct.optional(),
  notes: z.string().max(2000).optional(),
  problemStatement: z.string().max(2000).optional(),
  signals: z.array(z.string().max(40)).max(40).optional(),
  bottleneck: z.string().max(40).optional(),
  context: z.string().max(2000).optional(),
  durationMin: z.number().min(1).max(600).optional(),
  distractions: z.number().int().min(0).max(500).optional(),
  difficulty: pct.optional(),
  outputQuality: pct.optional(),
  assetName: z.string().max(200).optional(),
  assetType: z.string().max(40).optional(),
  capitalCategory: z.string().max(40).optional(),
  capitalAmount: z.number().min(0).max(100).optional(),
});

// GET /api/growth-protocol/:id -> run detail (open).
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const run = await getRun(userId, id);
    return run ? ok({ run }) : notFound("Run not found");
  });
}

// POST /api/growth-protocol/:id -> record OR orchestrate any stage / the full loop (gated).
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "growth_protocol");
    const { id } = await ctx.params;
    const b = await parseBody(req, Body);
    const practice = { durationMin: b.durationMin ?? 60, distractions: b.distractions ?? 2, difficulty: b.difficulty ?? 0.7, outputQuality: b.outputQuality ?? 0.6 };
    const compound = { assetName: b.assetName, assetType: b.assetType, capitalCategory: b.capitalCategory, capitalAmount: b.capitalAmount };

    if (b.action === "diagnose") return ok(await orchestrateDiagnose(userId, id, { problemStatement: b.problemStatement, signals: b.signals }));
    if (b.action === "design") return ok(await orchestrateDesign(userId, id, { bottleneck: b.bottleneck, context: b.context }));
    if (b.action === "practice") return ok(await orchestratePractice(userId, id, practice));
    if (b.action === "compound") return ok(await orchestrateCompound(userId, id, compound));
    if (b.action === "full-loop") return ok(await runFullLoop(userId, id, { problemStatement: b.problemStatement, signals: b.signals, context: b.context, practice, compound }));
    if (!b.stage || b.score == null) return badRequest("stage and score required to record");
    await recordStage(userId, id, b.stage, { score: b.score, notes: b.notes });
    return ok({ run: await getRun(userId, id) });
  });
}
