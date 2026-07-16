import crypto from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { configuredPaymentProvider, parsePaymentNotification } from "../src/lib/payments";

const original = { ...process.env };
afterEach(() => { vi.unstubAllEnvs(); process.env = { ...original }; });

describe("payment trust boundary", () => {
  it("accepts an authentic Alipay RSA2 notification and extracts settlement facts", async () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    process.env.ALIPAY_APP_ID = "test-app";
    process.env.ALIPAY_PUBLIC_KEY = publicKey.export({ type: "spki", format: "pem" }).toString();
    const params = new URLSearchParams({ app_id: "test-app", out_trade_no: "MOS123", trade_no: "ALI456", total_amount: "99.00", trade_status: "TRADE_SUCCESS", sign_type: "RSA2" });
    const content = [...params.entries()].filter(([key]) => key !== "sign" && key !== "sign_type").sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
    params.set("sign", crypto.sign("RSA-SHA256", Buffer.from(content), privateKey).toString("base64"));
    const notification = await parsePaymentNotification("alipay", new Request("https://arete.test/api/payments/alipay/notify", { method: "POST", body: params.toString() }));
    expect(notification).toMatchObject({ provider: "alipay", outTradeNo: "MOS123", transactionId: "ALI456", amount: 99, currency: "CNY", paid: true });
    expect(notification.payloadHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects a forged Alipay notification", async () => {
    const { publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    process.env.ALIPAY_APP_ID = "test-app";
    process.env.ALIPAY_PUBLIC_KEY = publicKey.export({ type: "spki", format: "pem" }).toString();
    const body = new URLSearchParams({ app_id: "test-app", out_trade_no: "MOS123", trade_no: "ALI456", total_amount: "0.01", trade_status: "TRADE_SUCCESS", sign: Buffer.from("forged").toString("base64") });
    await expect(parsePaymentNotification("alipay", new Request("https://arete.test/notify", { method: "POST", body: body.toString() }))).rejects.toThrow("Invalid Alipay signature");
  });

  it("never permits mock payment in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.PAYMENT_PROVIDER = "mock";
    process.env.PAYMENT_MOCK_ENABLED = "true";
    expect(() => configuredPaymentProvider()).toThrow("Payments are currently unavailable");
  });
});
