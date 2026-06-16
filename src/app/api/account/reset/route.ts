import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { resetGrowthData } from "@/lib/account-data";

const Body = z.object({ confirm: z.literal(true) });

// POST /api/account/reset -> wipe the current user's growth-loop data (requires confirm).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await parseBody(req, Body);
    return ok(await resetGrowthData(userId));
  });
}
