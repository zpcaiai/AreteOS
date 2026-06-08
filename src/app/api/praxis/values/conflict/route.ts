import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { BusinessValueArchitect } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      founderValues: z.array(z.string()).default([]), behaviors: z.array(z.string()).default([]),
    }));
    const out = await BusinessValueArchitect.run(body);
    return ok({ conflicts: out.conflicts, values: out.values });
  });
}
