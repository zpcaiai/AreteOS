import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { latestRiskLevel } from "@/lib/healing/gate";
import { recordRelapseCheckIn } from "@/lib/healing/relapse-prevention";
import { RelapseCheckInInputSchema } from "@/lib/domain/relapse-prevention";

// POST /api/relapse-checkin -> log a maintenance check-in; returns the relapse band.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, RelapseCheckInInputSchema.omit({ userId: true }));
    const riskLevel = b.sessionId ? await latestRiskLevel(userId, b.sessionId) : "green";
    const result = await recordRelapseCheckIn({ userId, ...b }, riskLevel);
    return ok({ result });
  });
}
