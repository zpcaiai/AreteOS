import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { WorldviewSimulator } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    await getUserId(req);
    const b = await parseBody(req, z.object({ worldviewA: z.string().min(1), worldviewB: z.string().min(1), context: z.string().optional() }));
    const out = await WorldviewSimulator.run(b);
    return ok({ ...out });
  });
}
