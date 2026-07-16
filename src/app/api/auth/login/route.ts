import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, requestSessionMetadata, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { parseBody, requireSameOrigin, route } from "@/lib/http";
import { anonymousClientKey, persistentRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const limited = await persistentRateLimit({ key: `auth:login:${anonymousClientKey(req)}`, limit: 8, windowMs: 15 * 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, z.object({ email: z.string().email().transform((v) => v.trim().toLowerCase()), password: z.string().min(1).max(200) }));
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !verifyPassword(body.password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const verificationRequired = process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === "true" || process.env.NODE_ENV === "production";
    if (verificationRequired && !user.emailVerifiedAt) {
      return NextResponse.json({ error: "Verify your email before signing in", code: "EMAIL_NOT_VERIFIED" }, { status: 403 });
    }
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(SESSION_COOKIE, await createSession(user.id, requestSessionMetadata(req)), sessionCookieOptions);
    return res;
  });
}
