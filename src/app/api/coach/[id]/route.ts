import { getUserId } from "@/lib/auth";
import { CoachMessageSchema } from "@/lib/schemas";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { getSession, sendMessage, archiveSession } from "@/lib/coach";
import { persistentRateLimit } from "@/lib/rate-limit";

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
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await ctx.params;

    const limited = await persistentRateLimit({
      key: `coach:${userId}`,
      limit: Number(process.env.COACH_RATE_LIMIT ?? "20"),
      windowMs: Number(process.env.COACH_RATE_WINDOW_MS ?? "60000"),
    });
    if (limited) return limited;

    const b = await parseBody(req, CoachMessageSchema);

    const wantsStream =
      new URL(req.url).searchParams.get("stream") === "1" || req.headers.get("accept")?.includes("text/event-stream");
    if (!wantsStream) return ok({ message: await sendMessage(userId, id, b.message) });

    const encoder = new TextEncoder();
    const sse = (event: string, data: unknown) => encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const message = await sendMessage(userId, id, b.message, (e) => controller.enqueue(sse(e.type, e)));
            controller.enqueue(sse("complete", { message }));
          } catch (e) {
            controller.enqueue(sse("error", { error: e instanceof Error ? e.message : String(e) }));
          } finally {
            controller.close();
          }
        },
      }),
      { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } },
    );
  });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    await archiveSession(userId, id);
    return ok({ archived: true });
  });
}
