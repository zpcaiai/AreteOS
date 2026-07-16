import { ok, route } from "@/lib/http";
import { parsePaymentNotification } from "@/lib/payments";
import { payAndFulfillByOutTradeNo } from "@/lib/emporion/service";
import { activateOrderByOutTradeNo } from "@/lib/membership/service";

export async function POST(req: Request) {
  return route(async () => {
    const notification = await parsePaymentNotification("wechat", req);
    if (!notification.paid) return ok({ ok: true, ignored: true });

    const order = notification.outTradeNo.startsWith("EMP")
      ? await payAndFulfillByOutTradeNo(notification)
      : (await activateOrderByOutTradeNo(notification)).order;
    return ok({ code: "SUCCESS", message: "成功", orderId: order.id });
  });
}
