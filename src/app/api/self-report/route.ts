import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { outcomeProgress, saveCheckin } from "@/lib/self-report";
import { OUTCOME_KEYS, SELF_REPORT_MIN, SELF_REPORT_MAX } from "@/lib/self-report-catalog";
import { recordFirstMeaningfulAction, track } from "@/lib/telemetry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok(await outcomeProgress(userId));
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      ratings: z.record(z.enum(OUTCOME_KEYS as [string, ...string[]]), z.number().min(SELF_REPORT_MIN).max(SELF_REPORT_MAX)),
      note: z.string().max(2000).optional(),
    }));
    const result = await saveCheckin(userId, body.ratings, body.note);
    await recordFirstMeaningfulAction(userId, "self_report");
    await track({ userId, name: "engine_run", props: { engine: "self_report", baseline: result.isBaseline, metrics: result.saved } });
    return created({ ...result, progress: await outcomeProgress(userId) });
  });
}
