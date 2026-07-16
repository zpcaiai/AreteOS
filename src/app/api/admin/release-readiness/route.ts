import { requireAdmin } from "@/lib/admin/auth";
import { ok, route } from "@/lib/http";
import { releaseReadiness } from "@/lib/release/readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return route(async () => {
    await requireAdmin();
    return ok(releaseReadiness());
  });
}
