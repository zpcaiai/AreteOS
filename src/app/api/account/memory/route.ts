import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { clearPersonalMemory, personalMemoryCount } from "@/lib/account-data";

// GET  /api/account/memory        -> how many AI memories are stored
// POST /api/account/memory {confirm:true} -> forget them all
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ count: await personalMemoryCount(userId) });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await parseBody(req, z.object({ confirm: z.literal(true) }));
    return ok(await clearPersonalMemory(userId));
  });
}
