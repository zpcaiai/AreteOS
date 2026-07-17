import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { runtimeReadiness } from "@/lib/release/readiness";

export const dynamic = "force-dynamic";

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
        AND to_regclass('public.foundry_workspaces') IS NOT NULL
        AND to_regclass('public.registration_invites') IS NOT NULL
        AND to_regclass('public.guardian_consents') IS NOT NULL
        AND to_regclass('public.security_audit_events') IS NOT NULL
        AND to_regclass('public.workspace_template_feedback') IS NOT NULL AS ready
    `);
    schema = row?.ready === true;
  } catch { /* exposed only as a boolean */ }
  const runtime = process.env.NODE_ENV === "production"
    ? runtimeReadiness()
    : { ready: true, failed: [] as string[], profile: "pilot" as const };
  const ready = database && schema && runtime.ready;
  return Response.json({
    status: ready ? "ready" : "not_ready",
    checks: { database, schema, configuration: runtime.ready },
    failedChecks: runtime.failed,
    releaseProfile: runtime.profile,
    version: process.env.APP_VERSION?.slice(0, 12) || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || process.env.npm_package_version || "development",
    latencyMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
