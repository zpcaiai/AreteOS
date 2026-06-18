import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { getLatestSafetyTriage } from "@/lib/healing/safety-triage";
import { runMentalStateIntake } from "@/lib/healing/mental-state-intake";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  freeText: z.string().optional(),
  ratings: z.record(z.number().min(0).max(10)).optional(),
  checkboxes: z.record(z.boolean()).optional(),
});

// POST /api/intake -> structured mental-state snapshot. Gated by the latest
// safety triage for the session: red blocks; orange runs stabilization routing.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);

    const safety = await getLatestSafetyTriage(userId, b.sessionId);
    if (safety?.riskLevel === "red") {
      return NextResponse.json(
        { error: "Cannot continue intake during red risk state.", route: "urgent_crisis_response" },
        { status: 409 },
      );
    }

    const result = await runMentalStateIntake(
      { userId, sessionId: b.sessionId, freeText: b.freeText, ratings: b.ratings, checkboxes: b.checkboxes },
      (safety?.riskLevel as "green" | "yellow" | "orange") ?? "green",
    );
    return ok({ result });
  });
}
