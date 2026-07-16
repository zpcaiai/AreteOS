import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, requireSameOrigin, route } from "@/lib/http";
import { price } from "@/lib/membership/plans";
import { configuredPaymentProvider, createPaymentCheckout } from "@/lib/payments";
import crypto from "node:crypto";
import { persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `checkout:${userId}`, limit: 10, windowMs: 10 * 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, z.object({
      tier: z.enum(["PLUS", "PRO"]),
      period: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
    }));
    const amount = price(body.tier, body.period);
    const outTradeNo = `MOS${Date.now()}${crypto.randomBytes(5).toString("hex")}`;
    const provider = configuredPaymentProvider();
    const order = await prisma.membershipOrder.create({
      data: { userId, tier: body.tier, period: body.period, amount, provider, outTradeNo, status: "CREATED" },
    });
    const checkout = await createPaymentCheckout({ outTradeNo, amount, currency: "CNY", subject: `Arete ${body.tier} ${body.period}` });
    return created({ order, payUrl: checkout.payUrl, provider });
  });
}
