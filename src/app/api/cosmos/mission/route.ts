import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { MissionGenerator } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    await getUserId(req);
    const b = await parseBody(req, z.object({ worldview: z.string().optional(), values: z.array(z.string()).default([]), themes: z.array(z.string()).default([]) }));
    const out = await MissionGenerator.run(b);
    return ok({ candidates: out.candidates });
  });
}
