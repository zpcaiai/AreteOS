import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, requireSameOrigin, route } from "@/lib/http";
import { createOrder } from "@/lib/emporion/service";
import { persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `checkout:${userId}`, limit: 10, windowMs: 10 * 60_000 });
    if (limited) return limited;
    const b = await parseBody(req, z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(99).default(1) }));
    const { order, payUrl } = await createOrder(userId, b.slug, b.quantity);
    return created({ order, payUrl });
  });
}
