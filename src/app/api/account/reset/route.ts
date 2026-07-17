import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { resetGrowthData } from "@/lib/account-data";
import { writeSecurityAudit } from "@/lib/security-audit";

const Body = z.object({ confirm: z.literal(true) });

// POST /api/account/reset -> wipe the current user's growth-loop data (requires confirm).
export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    await parseBody(req, Body);
    const result = await resetGrowthData(userId);
    await writeSecurityAudit(req, { actorId: userId, action: "account.growth.reset", targetType: "user", targetId: userId });
    return ok(result);
  });
}
