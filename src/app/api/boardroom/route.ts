import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { listBoardroomSessions, runBoardroom } from "@/lib/boardroom";

const Body = z.object({
  question: z.string().min(3).max(2000),
  context: z.string().max(4000).optional(),
  options: z.array(z.string().max(400)).max(8).optional(),
  advisors: z.array(z.string().max(40)).max(12).optional(),
});

// POST /api/boardroom -> convene the advisory board (Pro-gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "boardroom");
    const b = await parseBody(req, Body);
    return ok({ result: await runBoardroom(userId, b) });
  });
}

// GET /api/boardroom -> recent sessions (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ sessions: await listBoardroomSessions(userId) });
  });
}
