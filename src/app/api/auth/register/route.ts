import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const body = await parseBody(req, z.object({
      email: z.string().email(), password: z.string().min(8), name: z.string().optional(),
    }));
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const user = await prisma.user.create({
      data: { email: body.email, name: body.name ?? null, passwordHash: hashPassword(body.password) },
    });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, signSession(user.id), sessionCookieOptions);
    return res;
  });
}
