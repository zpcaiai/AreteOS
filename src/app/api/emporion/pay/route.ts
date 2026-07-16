import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { HttpError, ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { payAndFulfill } from "@/lib/emporion/service";

// Virtual goods: payment completes delivery in the same transaction.
// Replace this endpoint's caller with a verified Alipay/WeChat notify in production.
export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    if (process.env.NODE_ENV === "production" || process.env.PAYMENT_MOCK_ENABLED !== "true") throw new HttpError(404, "Not found");
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ orderId: z.string().min(1) }));
    const order = await payAndFulfill(b.orderId, userId);
    return ok({ order });
  });
}
