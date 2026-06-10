import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { listSessions, createSession } from "@/lib/coach";

// GET /api/coach        -> list active coaching sessions
// POST /api/coach       -> start a new coaching session
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ sessions: await listSessions(userId) });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(
      req,
      z.object({ title: z.string().max(120).optional(), focus: z.enum(["", "decisions", "habits", "naval", "reflection"]).optional() }),
    );
    return created({ session: await createSession(userId, b) });
  });
}
