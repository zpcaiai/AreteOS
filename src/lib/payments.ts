import crypto from "node:crypto";
import { HttpError } from "./http";

export type PaymentProvider = "alipay" | "wechat";
export interface PaymentNotification {
  provider: PaymentProvider; outTradeNo: string; transactionId: string;
  amount: number; currency: string; paid: boolean; payloadHash: string;
}
interface CheckoutInput { outTradeNo: string; amount: number; currency: string; subject: string }
interface RefundInput { provider: PaymentProvider; outTradeNo: string; amount: number; currency: string; reason: string; refundNo: string }

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new HttpError(503, `Payment provider is not configured (${name})`);
  return value.replace(/\\n/g, "\n");
};

export function configuredPaymentProvider(): PaymentProvider | "mock" {
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_ENABLED !== "true") {
    throw new HttpError(503, "Payments are currently unavailable (disabled for the current release profile)");
  }
  const value = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (value === "alipay" || value === "wechat") return value;
  if (value === "mock" && process.env.NODE_ENV !== "production" && process.env.PAYMENT_MOCK_ENABLED === "true") return "mock";
  throw new HttpError(503, "Payments are currently unavailable");
}

const rsaSign = (content: string, privateKey: string) => crypto.sign("RSA-SHA256", Buffer.from(content), privateKey).toString("base64");
const rsaVerify = (content: string, signature: string, publicKey: string) => crypto.verify("RSA-SHA256", Buffer.from(content), publicKey, Buffer.from(signature, "base64"));

async function createAlipayCheckout(input: CheckoutInput) {
  if (input.currency !== "CNY") throw new HttpError(400, "Alipay checkout requires CNY");
  const params: Record<string, string> = {
    app_id: required("ALIPAY_APP_ID"), method: "alipay.trade.page.pay", format: "JSON", charset: "utf-8",
    sign_type: "RSA2", timestamp: new Date().toISOString().replace("T", " ").slice(0, 19), version: "1.0",
    notify_url: process.env.ALIPAY_NOTIFY_URL || `${siteUrl()}/api/payments/alipay/notify`,
    return_url: process.env.ALIPAY_RETURN_URL || `${siteUrl()}/membership`,
    biz_content: JSON.stringify({ out_trade_no: input.outTradeNo, total_amount: input.amount.toFixed(2), subject: input.subject.slice(0, 256), product_code: "FAST_INSTANT_TRADE_PAY" }),
  };
  const content = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  params.sign = rsaSign(content, required("ALIPAY_PRIVATE_KEY"));
  return `${process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do"}?${new URLSearchParams(params)}`;
}

function wechatAuthorization(method: string, pathname: string, body: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const signature = rsaSign(`${method}\n${pathname}\n${timestamp}\n${nonce}\n${body}\n`, required("WECHAT_PAY_PRIVATE_KEY"));
  return `WECHATPAY2-SHA256-RSA2048 mchid="${required("WECHAT_PAY_MCH_ID")}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${required("WECHAT_PAY_SERIAL_NO")}",signature="${signature}"`;
}

async function createWechatCheckout(input: CheckoutInput) {
  if (input.currency !== "CNY") throw new HttpError(400, "WeChat Pay checkout requires CNY");
  const pathname = "/v3/pay/transactions/native";
  const body = JSON.stringify({
    appid: required("WECHAT_PAY_APP_ID"), mchid: required("WECHAT_PAY_MCH_ID"), description: input.subject.slice(0, 127), out_trade_no: input.outTradeNo,
    notify_url: process.env.WECHAT_PAY_NOTIFY_URL || `${siteUrl()}/api/payments/wechat/notify`, amount: { total: Math.round(input.amount * 100), currency: input.currency },
  });
  const response = await fetch(`https://api.mch.weixin.qq.com${pathname}`, { method: "POST", headers: { Authorization: wechatAuthorization("POST", pathname, body), Accept: "application/json", "Content-Type": "application/json", "User-Agent": "AreteOS/1.0" }, body });
  const data = await response.json().catch(() => ({})) as { code_url?: string; message?: string };
  if (!response.ok || !data.code_url) throw new HttpError(502, `WeChat Pay checkout failed: ${data.message || response.status}`);
  return data.code_url;
}

export async function createPaymentCheckout(input: CheckoutInput) {
  const provider = configuredPaymentProvider();
  if (provider === "mock") return { provider, payUrl: null as string | null };
  return { provider, payUrl: provider === "alipay" ? await createAlipayCheckout(input) : await createWechatCheckout(input) };
}

async function refundAlipay(input: RefundInput) {
  if (input.currency !== "CNY") throw new HttpError(400, "Alipay refund requires CNY");
  const params: Record<string, string> = {
    app_id: required("ALIPAY_APP_ID"),
    method: "alipay.trade.refund",
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    version: "1.0",
    biz_content: JSON.stringify({
      out_trade_no: input.outTradeNo,
      refund_amount: input.amount.toFixed(2),
      refund_reason: input.reason.slice(0, 256),
      out_request_no: input.refundNo,
    }),
  };
  const content = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  params.sign = rsaSign(content, required("ALIPAY_PRIVATE_KEY"));
  const response = await fetch(`${process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do"}?${new URLSearchParams(params)}`);
  const payload = await response.json().catch(() => ({})) as Record<string, { code?: string; msg?: string; sub_msg?: string; trade_no?: string }>;
  const result = payload.alipay_trade_refund_response;
  if (!response.ok || result?.code !== "10000") throw new HttpError(502, `Alipay refund failed: ${result?.sub_msg || result?.msg || response.status}`);
  return { providerRefundId: result.trade_no || input.refundNo, status: "SUCCESS" };
}

async function refundWechat(input: RefundInput) {
  if (input.currency !== "CNY") throw new HttpError(400, "WeChat Pay refund requires CNY");
  const pathname = "/v3/refund/domestic/refunds";
  const notifyUrl = process.env.WECHAT_PAY_REFUND_NOTIFY_URL;
  const body = JSON.stringify({
    out_trade_no: input.outTradeNo,
    out_refund_no: input.refundNo,
    reason: input.reason.slice(0, 80),
    ...(notifyUrl ? { notify_url: notifyUrl } : {}),
    amount: {
      refund: Math.round(input.amount * 100),
      total: Math.round(input.amount * 100),
      currency: input.currency,
    },
  });
  const response = await fetch(`https://api.mch.weixin.qq.com${pathname}`, {
    method: "POST",
    headers: {
      Authorization: wechatAuthorization("POST", pathname, body),
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "AreteOS/1.0",
    },
    body,
  });
  const payload = await response.json().catch(() => ({})) as { refund_id?: string; status?: string; message?: string };
  if (!response.ok || !payload.refund_id) throw new HttpError(502, `WeChat Pay refund failed: ${payload.message || response.status}`);
  return { providerRefundId: payload.refund_id, status: payload.status || "PROCESSING" };
}

export async function refundPayment(input: RefundInput) {
  if (input.amount <= 0 || !Number.isFinite(input.amount)) throw new HttpError(400, "Refund amount is invalid");
  if (process.env.PAYMENT_REFUNDS_ENABLED !== "true") throw new HttpError(503, "Provider refunds are disabled");
  return input.provider === "alipay" ? refundAlipay(input) : refundWechat(input);
}

function parseAlipay(raw: string): PaymentNotification {
  const params = new URLSearchParams(raw);
  const signature = params.get("sign");
  if (!signature) throw new HttpError(401, "Missing Alipay signature");
  const content = [...params.entries()].filter(([key]) => key !== "sign" && key !== "sign_type").sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
  if (!rsaVerify(content, signature, required("ALIPAY_PUBLIC_KEY"))) throw new HttpError(401, "Invalid Alipay signature");
  if (params.get("app_id") !== required("ALIPAY_APP_ID")) throw new HttpError(401, "Alipay app mismatch");
  const outTradeNo = params.get("out_trade_no") || "";
  const transactionId = params.get("trade_no") || "";
  const amount = Number(params.get("total_amount"));
  if (!outTradeNo || !transactionId || !Number.isFinite(amount)) throw new HttpError(400, "Invalid Alipay notification");
  return { provider: "alipay", outTradeNo, transactionId, amount, currency: "CNY", paid: ["TRADE_SUCCESS", "TRADE_FINISHED"].includes(params.get("trade_status") || ""), payloadHash: sha256(raw) };
}

function decryptWechatResource(resource: Record<string, unknown>) {
  const key = Buffer.from(required("WECHAT_PAY_API_V3_KEY"));
  if (key.length !== 32) throw new HttpError(503, "WECHAT_PAY_API_V3_KEY must be 32 bytes");
  const encrypted = Buffer.from(String(resource.ciphertext || ""), "base64");
  if (encrypted.length < 17) throw new HttpError(400, "Invalid WeChat encrypted resource");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, String(resource.nonce || ""));
  decipher.setAAD(Buffer.from(String(resource.associated_data || "")));
  decipher.setAuthTag(encrypted.subarray(-16));
  return JSON.parse(Buffer.concat([decipher.update(encrypted.subarray(0, -16)), decipher.final()]).toString("utf8")) as Record<string, unknown>;
}

function parseWechat(req: Request, raw: string): PaymentNotification {
  const timestamp = req.headers.get("wechatpay-timestamp") || "";
  const nonce = req.headers.get("wechatpay-nonce") || "";
  const signature = req.headers.get("wechatpay-signature") || "";
  const serial = req.headers.get("wechatpay-serial") || "";
  if (!timestamp || !nonce || !signature || !serial) throw new HttpError(401, "Missing WeChat Pay signature headers");
  if (serial !== required("WECHAT_PAY_PLATFORM_SERIAL_NO")) throw new HttpError(401, "Unknown WeChat Pay certificate");
  if (!Number.isFinite(Number(timestamp)) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new HttpError(401, "Stale WeChat Pay notification");
  if (!rsaVerify(`${timestamp}\n${nonce}\n${raw}\n`, signature, required("WECHAT_PAY_PLATFORM_PUBLIC_KEY"))) throw new HttpError(401, "Invalid WeChat Pay signature");
  const envelope = JSON.parse(raw) as { resource?: Record<string, unknown> };
  if (!envelope.resource) throw new HttpError(400, "Missing WeChat Pay resource");
  const body = decryptWechatResource(envelope.resource);
  const amountBody = body.amount as Record<string, unknown> | undefined;
  const outTradeNo = String(body.out_trade_no || "");
  const transactionId = String(body.transaction_id || "");
  const amount = Number(amountBody?.total) / 100;
  const currency = String(amountBody?.currency || "CNY");
  if (!outTradeNo || !transactionId || !Number.isFinite(amount)) throw new HttpError(400, "Invalid WeChat Pay notification");
  return { provider: "wechat", outTradeNo, transactionId, amount, currency, paid: body.trade_state === "SUCCESS", payloadHash: sha256(raw) };
}

export async function parsePaymentNotification(provider: PaymentProvider, req: Request): Promise<PaymentNotification> {
  const raw = await req.text();
  if (raw.length > 128_000) throw new HttpError(413, "Payment notification too large");
  return provider === "alipay" ? parseAlipay(raw) : parseWechat(req, raw);
}
