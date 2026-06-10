import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { replayEvents } from "@/lib/events";

const ReplaySchema = z.object({
  until: z.string().datetime().optional(),
  aggregateType: z.string().optional(),
  aggregateId: z.string().optional(),
});

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, ReplaySchema);
    const replay = await replayEvents({
      userId,
      until: body.until ? new Date(body.until) : undefined,
      aggregateType: body.aggregateType,
      aggregateId: body.aggregateId,
    });
    return ok({ replay });
  });
}
