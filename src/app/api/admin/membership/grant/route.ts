import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { grantMembership } from "@/lib/admin/service";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const adminId = await requireAdmin();
    const b = await parseBody(req, z.object({
      userId: z.string().min(1), tier: z.enum(["PLUS", "PRO"]), days: z.number().int().min(1).max(3650),
    }));
    const membership = await grantMembership(b.userId, b.tier, b.days);
    await writeSecurityAudit(req, { actorId: adminId, action: "membership.grant", targetType: "user", targetId: b.userId, metadata: { tier: b.tier, days: b.days } });
    return ok({ membership });
  });
}
