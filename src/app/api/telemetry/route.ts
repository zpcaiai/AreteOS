import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/admin/auth";
import { CLIENT_EVENTS, telemetrySummary, track } from "@/lib/telemetry";

const bodySchema = z.object({
  name: z.enum(CLIENT_EVENTS),
  props: z.record(z.string(), z.unknown()).optional(),
  sessionId: z.string().max(64).optional(),
});

/** Client-side product telemetry ingestion. Best-effort, rate-limited, whitelist-only. */
export async function POST(req: Request) {
  return route(async () => {
    const limited = rateLimit({ key: `telemetry:${clientIp(req)}`, limit: 240, windowMs: 60_000 });
    if (limited) return limited;

    const userId = await getUserId(req);
    const body = await parseBody(req, bodySchema);
    await track({ userId, name: body.name, props: body.props ?? null, sessionId: body.sessionId ?? null });
    return ok({ ok: true }, { status: 202 });
  });
}

/** Admin-only funnel/retention summary. */
export async function GET(req: Request) {
  return route(async () => {
    await requireAdmin();
    const url = new URL(req.url);
    const windowDays = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? "7") || 7));
    return ok(await telemetrySummary(windowDays));
  });
}
