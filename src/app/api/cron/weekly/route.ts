import { NextResponse } from "next/server";
import { ok, route } from "@/lib/http";
import { runWeeklyForAllUsers } from "@/lib/growth-card";

// Authorize via ?secret=... or `Authorization: Bearer <secret>` (Vercel-Cron style).
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  return process.env.NODE_ENV !== "production" && new URL(req.url).searchParams.get("secret") === secret;
}

// GET/POST /api/cron/weekly?secret=... -> generate weekly growth cards for ALL users.
// Trigger from any cron (Vercel Cron, a server crontab, or a Cowork scheduled task
// that fetches this URL). No user session required; protected by CRON_SECRET.
async function handle(req: Request) {
  return route(async () => {
    if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await runWeeklyForAllUsers(Number(process.env.WEEKLY_CONCURRENCY ?? "8") || 8);
    return ok({ ranAt: new Date().toISOString(), ...result });
  });
}

export const GET = handle;
export const POST = handle;
