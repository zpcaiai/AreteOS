import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function requiredEnvironment() {
  if (process.env.NODE_ENV !== "production") return [];
  const names = ["DATABASE_URL", "DIRECT_URL", "AUTH_SECRET", "NEXT_PUBLIC_SITE_URL", "RESEND_API_KEY", "AUTH_EMAIL_FROM", "SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN", "ADMIN_EMAILS", "CRON_SECRET"];
  if (process.env.PAYMENT_PROVIDER === "alipay") names.push("ALIPAY_APP_ID", "ALIPAY_PRIVATE_KEY", "ALIPAY_PUBLIC_KEY");
  else if (process.env.PAYMENT_PROVIDER === "wechat") names.push("WECHAT_PAY_APP_ID", "WECHAT_PAY_MCH_ID", "WECHAT_PAY_PRIVATE_KEY", "WECHAT_PAY_SERIAL_NO", "WECHAT_PAY_API_V3_KEY", "WECHAT_PAY_PLATFORM_PUBLIC_KEY", "WECHAT_PAY_PLATFORM_SERIAL_NO");
  else names.push("PAYMENT_PROVIDER");
  const missing = names.filter((name) => !process.env[name]);
  if ((process.env.AUTH_SECRET?.length ?? 0) < 32) missing.push("AUTH_SECRET(minimum 32 characters)");
  if (!process.env.AI_PROVIDER || process.env.AI_PROVIDER === "mock") missing.push("AI_PROVIDER(real provider required)");
  return [...new Set(missing)];
}

export async function GET() {
  const startedAt = Date.now();
  let database = false;
  let schema = false;
  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    database = true;
    const [row] = await prisma.$queryRaw<Array<{ ready: boolean }>>(Prisma.sql`
      SELECT to_regclass('public.users') IS NOT NULL
        AND to_regclass('public.auth_sessions') IS NOT NULL
        AND to_regclass('public.rate_limit_buckets') IS NOT NULL
        AND to_regclass('public.foundry_workspaces') IS NOT NULL AS ready
    `);
    schema = row?.ready === true;
  } catch { /* exposed only as a boolean */ }
  const missingEnvironment = requiredEnvironment();
  const ready = database && schema && missingEnvironment.length === 0;
  return Response.json({
    status: ready ? "ready" : "not_ready",
    checks: { database, schema, configuration: missingEnvironment.length === 0 },
    missingConfiguration: missingEnvironment,
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || process.env.npm_package_version || "development",
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
