import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { assessWealth } from "@/lib/naval/engines";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const profile = await prisma.wealthProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { assets: true, incomeStreams: true } });
    return ok({ profile });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "naval");
    const b = await parseBody(req, z.object({ incomeStreams: z.array(z.string()).optional(), assets: z.array(z.string()).optional() }));
    return created(await assessWealth(userId, b));
  });
}
