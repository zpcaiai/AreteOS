import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { runCouncil } from "@/lib/council";

const CouncilSchema = z.object({
  question: z.string().min(3).max(2000),
  context: z.string().max(4000).optional(),
  options: z.array(z.string().max(400)).max(8).optional(),
});

// POST /api/council -> a panel of mentor lenses debate the question; returns each
// position, how much they actually agree, and the moderator's synthesis.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "council");
    const b = await parseBody(req, CouncilSchema);
    return ok({ council: await runCouncil(userId, b) });
  });
}
