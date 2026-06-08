import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth gate. Off by default so local dev (DEV_USER_ID) is frictionless; set
// AUTH_REQUIRED=true in production to force login. Only checks cookie presence —
// cryptographic verification happens in getUserId() (node runtime).
const PUBLIC_PREFIXES = ["/login", "/api/auth"];

export function middleware(req: NextRequest) {
  if (process.env.AUTH_REQUIRED !== "true") return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  if (req.cookies.get("mos_session")) return NextResponse.next();

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
