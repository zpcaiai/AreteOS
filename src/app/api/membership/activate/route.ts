import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { HttpError, ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { activateOrder } from "@/lib/membership/service";

// Activates a paid order. In production this is the payment-gateway notify
// callback (after signature verification); here it doubles as a mock "pay now".
export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    if (process.env.NODE_ENV === "production" || process.env.PAYMENT_MOCK_ENABLED !== "true") throw new HttpError(404, "Not found");
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ orderId: z.string().min(1) }));
    const { membership } = await activateOrder(body.orderId, userId);
    return ok({ membership });
  });
}
