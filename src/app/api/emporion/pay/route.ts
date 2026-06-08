import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { payAndFulfill } from "@/lib/emporion/service";

// Virtual goods: payment completes delivery in the same transaction.
// Replace this endpoint's caller with a verified Alipay/WeChat notify in production.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ orderId: z.string().min(1) }));
    const order = await payAndFulfill(b.orderId, userId);
    return ok({ order });
  });
}
