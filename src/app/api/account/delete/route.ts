import { z } from "zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { deleteEntireAccount } from "@/lib/data-rights";
import { parseBody, requireSameOrigin, route } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";
import { persistentRateLimit } from "@/lib/rate-limit";
import { writeSecurityAudit } from "@/lib/security-audit";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `account-delete:${userId}`, limit: 3, windowMs: 60 * 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, z.object({ password: z.string().min(1).max(200), confirmation: z.literal("DELETE MY ACCOUNT") }));
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
    if (!user || !verifyPassword(body.password, user.passwordHash)) return NextResponse.json({ error: "Password is incorrect" }, { status: 403 });
    await writeSecurityAudit(req, { actorId: userId, action: "account.delete", targetType: "user", targetId: userId });
    const result = await deleteEntireAccount(userId);
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    const response = NextResponse.json({ ok: true, ...result });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    return response;
  });
}
