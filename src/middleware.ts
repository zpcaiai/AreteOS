import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge gate only rejects obviously anonymous traffic. Database-backed session
// verification still happens in getUserId() at the route boundary.
const PUBLIC_PREFIXES = [
  "/login", "/forgot-password", "/reset-password", "/verify-email", "/privacy", "/terms",
  "/api/auth", "/api/health", "/api/payments", "/api/cron",
];
const PENDING_CLINICAL_PAGES = ["/healing", "/healing-os", "/core-belief", "/cbt", "/emotion-regulation", "/stabilization", "/parts-work", "/exposure", "/identity-rebuild", "/healing-timeline", "/relapse-prevention"];
const PENDING_CLINICAL_APIS = ["/api/healing", "/api/core-belief", "/api/cbt", "/api/emotion-regulation", "/api/trauma-stabilization", "/api/parts-work", "/api/exposure", "/api/identity-reconstruction", "/api/identity-evidence", "/api/healing-timeline", "/api/relapse-prevention", "/api/relapse-checkin"];
const CHILD_PAGES = ["/genius", "/genius-kids"];
const CHILD_APIS = ["/api/genius"];
const PAYMENT_APIS = ["/api/membership/checkout", "/api/membership/activate", "/api/emporion/checkout", "/api/emporion/pay"];

function isPendingClinicalPath(pathname: string) {
  const prefixes = pathname.startsWith("/api/") ? PENDING_CLINICAL_APIS : PENDING_CLINICAL_PAGES;
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function secure(response: NextResponse, nonce: string) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Content-Security-Policy", `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; img-src 'self' data: blob: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; connect-src 'self' https:; upgrade-insecure-requests`);
  if (process.env.NODE_ENV === "production") response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Request-Id", crypto.randomUUID());
  return response;
}

function pass(req: NextRequest, nonce: string) {
  const headers = new Headers(req.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`);
  headers.set("x-request-id", crypto.randomUUID());
  return NextResponse.next({ request: { headers } });
}

export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const authRequired = process.env.NODE_ENV === "production" || process.env.AUTH_REQUIRED === "true";
  if (!authRequired) return secure(pass(req, nonce), nonce);

  const { pathname } = req.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return secure(pass(req, nonce), nonce);

  if (req.cookies.get("arete_session")) {
    if (process.env.NODE_ENV === "production" && process.env.CLINICAL_FEATURE_ENABLED !== "true" && process.env.CLINICAL_PREVIEW_ENABLED !== "true" && isPendingClinicalPath(pathname)) {
      if (pathname.startsWith("/api/")) return secure(NextResponse.json({ error: "This clinical module is unavailable pending licensed expert review", code: "CLINICAL_REVIEW_PENDING" }, { status: 403 }), nonce);
      const safety = req.nextUrl.clone();
      safety.pathname = "/safety";
      safety.searchParams.set("notice", "clinical-review-pending");
      return secure(NextResponse.redirect(safety), nonce);
    }
    if (process.env.NODE_ENV === "production" && process.env.CHILD_FEATURE_ENABLED !== "true" && matches(pathname, pathname.startsWith("/api/") ? CHILD_APIS : CHILD_PAGES)) {
      if (pathname.startsWith("/api/")) return secure(NextResponse.json({ error: "Child features are disabled pending safeguarding and privacy review", code: "CHILD_FEATURE_DISABLED" }, { status: 403 }), nonce);
      const dashboard = req.nextUrl.clone();
      dashboard.pathname = "/dashboard";
      dashboard.searchParams.set("notice", "child-feature-disabled");
      return secure(NextResponse.redirect(dashboard), nonce);
    }
    if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_ENABLED !== "true" && matches(pathname, PAYMENT_APIS)) {
      return secure(NextResponse.json({ error: "Payments are disabled for the current release profile", code: "PAYMENTS_DISABLED" }, { status: 403 }), nonce);
    }
    return secure(pass(req, nonce), nonce);
  }

  if (pathname.startsWith("/api")) {
    return secure(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), nonce);
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  return secure(NextResponse.redirect(url), nonce);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
