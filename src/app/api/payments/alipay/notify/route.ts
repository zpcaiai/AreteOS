import { route } from "@/lib/http";
import { parsePaymentNotification } from "@/lib/payments";
import { payAndFulfillByOutTradeNo } from "@/lib/emporion/service";
import { activateOrderByOutTradeNo } from "@/lib/membership/service";

export async function POST(req: Request) {
  return route(async () => {
    const notification = await parsePaymentNotification("alipay", req);
    if (!notification.paid) return new Response("success", { status: 200, headers: { "content-type": "text/plain" } });

    const order = notification.outTradeNo.startsWith("EMP")
      ? await payAndFulfillByOutTradeNo(notification)
      : (await activateOrderByOutTradeNo(notification)).order;
    return new Response("success", { status: 200, headers: { "content-type": "text/plain" } });
  });
}
