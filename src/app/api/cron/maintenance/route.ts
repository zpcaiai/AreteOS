import { NextResponse } from "next/server";
import { ok, route } from "@/lib/http";
import { runMaintenance } from "@/lib/maintenance";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return route(async () => {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return ok({ ranAt: new Date().toISOString(), ...(await runMaintenance()) });
  });
}
