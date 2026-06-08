import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { createOrder } from "@/lib/emporion/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(99).default(1) }));
    const { order, payUrl } = await createOrder(userId, b.slug, b.quantity);
    return created({ order, payUrl });
  });
}
