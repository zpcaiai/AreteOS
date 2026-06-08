import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const body = await parseBody(req, z.object({ email: z.string().email(), password: z.string() }));
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !verifyPassword(body.password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(SESSION_COOKIE, signSession(user.id), sessionCookieOptions);
    return res;
  });
}
