import { NextResponse } from "next/server";

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  hit.count += 1;
  if (hit.count <= limit) return null;

  const retryAfter = Math.ceil((hit.resetAt - now) / 1000);
  return NextResponse.json(
    { error: "Rate limit exceeded", retryAfter },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(hit.resetAt / 1000)),
      },
    },
  );
}
