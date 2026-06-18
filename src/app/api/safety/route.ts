import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { runSafetyTriage } from "@/lib/healing/safety-triage";

// userId comes from the session — never the body — so the gate can't be spoofed.
const BodySchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
  context: z
    .object({
      previousRiskLevel: z.enum(["green", "yellow", "orange", "red"]).optional(),
      recentMoodScore: z.number().min(0).max(10).optional(),
      recentSleepHours: z.number().min(0).max(24).optional(),
      hasKnownCrisisHistory: z.boolean().optional(),
      locale: z.string().default("zh-CN"),
    })
    .optional(),
});

// POST /api/safety -> classify acute risk, persist the event, return the safe
// response (route + allowed/blocked skills + user-facing message + safety plan).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, BodySchema);
    const result = await runSafetyTriage({ userId, sessionId: b.sessionId, message: b.message, context: b.context });
    return ok({ result });
  });
}
