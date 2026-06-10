import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { getSession, sendMessage, archiveSession } from "@/lib/coach";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// GET    /api/coach/:id   -> session + messages
// POST   /api/coach/:id   -> send a message, returns the coach's reply
// DELETE /api/coach/:id   -> archive the session
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    return ok({ session: await getSession(userId, id) });
  });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;

    const limited = rateLimit({
      key: `coach:${userId}:${clientIp(req)}`,
      limit: Number(process.env.COACH_RATE_LIMIT ?? "20"),
      windowMs: Number(process.env.COACH_RATE_WINDOW_MS ?? "60000"),
    });
    if (limited) return limited;

    const b = await parseBody(req, z.object({ message: z.string().min(1).max(4000) }));
    return ok({ message: await sendMessage(userId, id, b.message) });
  });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    await archiveSession(userId, id);
    return ok({ archived: true });
  });
}
