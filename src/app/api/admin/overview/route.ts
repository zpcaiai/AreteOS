import { requireAdmin } from "@/lib/admin/auth";
import { overview } from "@/lib/admin/service";
import { ok, route } from "@/lib/http";
export async function GET() {
  return route(async () => { await requireAdmin(); return ok(await overview()); });
}
