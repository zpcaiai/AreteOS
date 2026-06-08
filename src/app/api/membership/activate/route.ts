import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { activateOrder } from "@/lib/membership/service";

// Activates a paid order. In production this is the payment-gateway notify
// callback (after signature verification); here it doubles as a mock "pay now".
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ orderId: z.string().min(1) }));
    const { membership } = await activateOrder(body.orderId, userId);
    return ok({ membership });
  });
}
