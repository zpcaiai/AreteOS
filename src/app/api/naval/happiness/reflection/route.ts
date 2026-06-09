import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { addHappinessReflection } from "@/lib/naval/engines";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ profileId: z.string().optional(), prompt: z.string().optional(), entry: z.string().min(1), practice: z.string().optional() }));
    return created({ reflection: await addHappinessReflection(userId, b) });
  });
}
