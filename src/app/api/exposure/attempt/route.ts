import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { recordExposureAttempt } from "@/lib/healing/exposure";
import { ExposureAttemptInputSchema } from "@/lib/domain/exposure";

// POST /api/exposure/attempt -> log a prediction-vs-outcome exposure attempt.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, ExposureAttemptInputSchema.omit({ userId: true }));
    const result = await recordExposureAttempt({ userId, ...b });
    return ok({ result });
  });
}
