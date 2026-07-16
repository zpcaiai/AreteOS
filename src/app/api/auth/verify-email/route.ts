import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeAuthToken } from "@/lib/auth-tokens";
import { createSession, requestSessionMetadata, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { parseBody, requireSameOrigin, route } from "@/lib/http";
import { anonymousClientKey, persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const limited = await persistentRateLimit({ key: `auth:verify:${anonymousClientKey(req)}`, limit: 12, windowMs: 15 * 60_000 });
    if (limited) return limited;
    const { token } = await parseBody(req, z.object({ token: z.string().min(32).max(200) }));
    const userId = await consumeAuthToken(token, "EMAIL_VERIFY");
    if (!userId) return NextResponse.json({ error: "Verification link is invalid or expired" }, { status: 400 });
    const user = await prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() }, select: { id: true, email: true, name: true } });
    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE, await createSession(userId, requestSessionMetadata(req)), sessionCookieOptions);
    return res;
  });
}
