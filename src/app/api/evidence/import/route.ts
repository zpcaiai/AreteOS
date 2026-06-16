import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ingestEvidence } from "@/lib/evidence";
import { parseGitLog, parseIcs } from "@/lib/evidence-connectors";

const ImportSchema = z.object({
  source: z.enum(["git", "ics"]),
  raw: z.string().min(1).max(200_000),
  kind: z.string().max(40).optional(),
  target: z.number().min(1).max(50).optional(),
});

// POST /api/evidence/import -> parse a git-log dump or an .ics export into
// behavioral evidence signals and ingest them (event-sourced).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "evidence");
    const b = await parseBody(req, ImportSchema);
    const signals = b.source === "git" ? parseGitLog(b.raw, { kind: b.kind, target: b.target }) : parseIcs(b.raw);
    if (signals.length === 0) return ok({ ingested: 0, note: "No signals parsed from the input." });
    return ok(await ingestEvidence(userId, signals));
  });
}
