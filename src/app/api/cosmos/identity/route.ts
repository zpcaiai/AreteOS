import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { IdentityNavigator } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    await getUserId(req);
    const b = await parseBody(req, z.object({ worldview: z.string().optional(), mission: z.string().optional() }));
    const out = await IdentityNavigator.run(b);
    return ok({ identities: out.identities, roadmap: out.roadmap });
  });
}
