import crypto from "node:crypto";
import { HttpError } from "./http";

export type PaymentProvider = "alipay" | "wechat";

export interface PaymentNotification {
  provider: PaymentProvider;
  outTradeNo: string;
  transactionId?: string;
  paid: boolean;
  raw: unknown;
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function verifyWebhookSignature(provider: PaymentProvider, rawBody: string, signature: string | null) {
  const secret = provider === "alipay" ? process.env.ALIPAY_WEBHOOK_SECRET : process.env.WECHAT_PAY_WEBHOOK_SECRET;
  if (!secret) throw new HttpError(501, `${provider} webhook is not configured`);
  if (!signature) throw new HttpError(401, "Missing payment signature");

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!timingSafeEqual(expected, signature)) throw new HttpError(401, "Invalid payment signature");
}

export async function parsePaymentNotification(provider: PaymentProvider, req: Request): Promise<PaymentNotification> {
  const rawBody = await req.text();
  verifyWebhookSignature(provider, rawBody, req.headers.get("x-arete-signature"));

  const body = JSON.parse(rawBody) as Record<string, unknown>;
  const outTradeNo = String(body.outTradeNo ?? body.out_trade_no ?? "");
  if (!outTradeNo) throw new HttpError(400, "Missing outTradeNo");

  const tradeStatus = String(body.tradeStatus ?? body.trade_status ?? body.status ?? "").toUpperCase();
  const paid = ["TRADE_SUCCESS", "TRADE_FINISHED", "SUCCESS", "PAID"].includes(tradeStatus);

  return {
    provider,
    outTradeNo,
    transactionId: body.transactionId ? String(body.transactionId) : body.transaction_id ? String(body.transaction_id) : undefined,
    paid,
    raw: body,
  };
}
