import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { price } from "@/lib/membership/plans";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      tier: z.enum(["PLUS", "PRO"]),
      period: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),
      provider: z.enum(["mock", "alipay", "wechat"]).default("mock"),
    }));
    const amount = price(body.tier, body.period);
    const outTradeNo = "MOS" + Date.now() + Math.floor(Math.random() * 1000);
    const order = await prisma.membershipOrder.create({
      data: { userId, tier: body.tier, period: body.period, amount, provider: body.provider, outTradeNo, status: "CREATED" },
    });
    // In production: create a real payment (Alipay/WeChat) and return its payUrl here.
    return created({ order, payUrl: null });
  });
}
