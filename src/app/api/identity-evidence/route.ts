import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { recordIdentityEvidence } from "@/lib/healing/identity";
import { IdentityEvidenceInputSchema } from "@/lib/domain/identity-rebuild";

// POST /api/identity-evidence -> log a daily identity-evidence action.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, IdentityEvidenceInputSchema.omit({ userId: true }));
    const result = await recordIdentityEvidence({ userId, ...b });
    return ok({ result });
  });
}
