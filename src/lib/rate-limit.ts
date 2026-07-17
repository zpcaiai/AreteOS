import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { privacyHash } from "./session";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

export function anonymousClientKey(req: Request) {
  return privacyHash(clientIp(req));
}

/** Database-backed fixed-window limiter, shared by every server instance. */
export async function persistentRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const [bucket] = await prisma.$queryRaw<Array<{ count: number; expiresAt: Date }>>(Prisma.sql`
    INSERT INTO "rate_limit_buckets" ("key", "count", "windowStart", "expiresAt", "updatedAt")
    VALUES (${key}, 1, ${now}, ${expiresAt}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limit_buckets"."expiresAt" <= ${now} THEN 1 ELSE "rate_limit_buckets"."count" + 1 END,
      "windowStart" = CASE WHEN "rate_limit_buckets"."expiresAt" <= ${now} THEN ${now} ELSE "rate_limit_buckets"."windowStart" END,
      "expiresAt" = CASE WHEN "rate_limit_buckets"."expiresAt" <= ${now} THEN ${expiresAt} ELSE "rate_limit_buckets"."expiresAt" END,
      "updatedAt" = ${now}
    RETURNING "count", "expiresAt"
  `);
  if (!bucket || bucket.count <= limit) return null;
  const retryAfter = Math.max(1, Math.ceil((bucket.expiresAt.getTime() - now.getTime()) / 1000));
  return NextResponse.json({ error: "Too many requests", retryAfter }, {
    status: 429,
    headers: { "Retry-After": String(retryAfter), "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": "0" },
  });
}
