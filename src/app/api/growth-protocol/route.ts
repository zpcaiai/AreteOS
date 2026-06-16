import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { createRun, listRuns } from "@/lib/growth-protocol";

const Body = z.object({ title: z.string().min(2).max(200), contextType: z.string().max(40).optional() });

// POST /api/growth-protocol -> start a protocol run (gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "growth_protocol");
    const b = await parseBody(req, Body);
    return created(await createRun(userId, b));
  });
}

// GET /api/growth-protocol -> list runs (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ runs: await listRuns(userId) });
  });
}
