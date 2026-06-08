import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, parseBody, route } from "@/lib/http";
import { grantMembership } from "@/lib/admin/service";

export async function POST(req: Request) {
  return route(async () => {
    await requireAdmin();
    const b = await parseBody(req, z.object({
      userId: z.string().min(1), tier: z.enum(["PLUS", "PRO"]), days: z.number().int().min(1).max(3650),
    }));
    const membership = await grantMembership(b.userId, b.tier, b.days);
    return ok({ membership });
  });
}
