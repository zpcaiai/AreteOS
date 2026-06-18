import { z } from "zod";
import { ok, route, parseBody } from "@/lib/http";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const VitalSchema = z.object({
  name: z.string().max(32),
  value: z.number().finite(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  id: z.string().max(64).optional(),
  path: z.string().max(512).optional(),
  navigationType: z.string().max(32).optional(),
});

/** Anonymous Web-Vitals beacon sink. Logs one structured line per metric. */
export async function POST(req: Request) {
  return route(async () => {
    const v = await parseBody(req, VitalSchema);
    logger.info(
      { webVital: v.name, value: v.value, rating: v.rating, path: v.path, navigationType: v.navigationType },
      `web-vital ${v.name}`,
    );
    return ok({ received: true });
  });
}
