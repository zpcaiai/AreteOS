import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireSameOrigin, route } from "@/lib/http";
import { revokeSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const store = await cookies();
    await revokeSession(store.get(SESSION_COOKIE)?.value);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    return res;
  });
}
