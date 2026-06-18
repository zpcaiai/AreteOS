import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { getLatestSafetyTriage } from "@/lib/healing/safety-triage";
import { runDiltsFormulation } from "@/lib/healing/dilts-formulation";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  problemStatement: z.string().min(1),
  intakeId: z.string().optional(),
  primaryConcerns: z.array(z.string()).optional(),
  dominantEmotions: z.array(z.string()).optional(),
  maintainingLoops: z.array(z.string()).optional(),
  userPreferences: z
    .object({
      depth: z.enum(["light", "standard", "deep"]).default("standard"),
      includeSpiritualMeaning: z.boolean().default(false),
      language: z.enum(["zh", "en"]).default("zh"),
    })
    .optional(),
});

// POST /api/dilts-map -> Dilts six-level map + 5P formulation. Risk level is
// read server-side from the latest triage (not the client): red blocks, orange
// forces shallow mode.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);

    const safety = await getLatestSafetyTriage(userId, b.sessionId);
    const riskLevel = (safety?.riskLevel as "green" | "yellow" | "orange" | "red") ?? "green";
    if (riskLevel === "red") {
      return NextResponse.json(
        { error: "Dilts formulation is blocked during red risk state.", route: "urgent_crisis_response" },
        { status: 409 },
      );
    }

    const result = await runDiltsFormulation({
      userId,
      sessionId: b.sessionId,
      problemStatement: b.problemStatement,
      intakeId: b.intakeId,
      context: {
        safetyRiskLevel: riskLevel,
        primaryConcerns: b.primaryConcerns,
        dominantEmotions: b.dominantEmotions,
        maintainingLoops: b.maintainingLoops,
      },
      userPreferences: b.userPreferences,
    });
    return ok({ result });
  });
}
