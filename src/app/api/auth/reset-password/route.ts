import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeAuthToken } from "@/lib/auth-tokens";
import { hashPassword } from "@/lib/password";
import { parseBody, requireSameOrigin, route } from "@/lib/http";
import { anonymousClientKey, persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const limited = await persistentRateLimit({ key: `auth:reset:${anonymousClientKey(req)}`, limit: 6, windowMs: 30 * 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, z.object({ token: z.string().min(32).max(200), password: z.string().min(12).max(200) }));
    const userId = await consumeAuthToken(body.token, "PASSWORD_RESET");
    if (!userId) return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash: hashPassword(body.password) } }),
      prisma.authSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    return NextResponse.json({ ok: true });
  });
}
