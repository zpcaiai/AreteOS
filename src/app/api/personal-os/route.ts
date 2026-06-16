import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { compileOS, listCompilations } from "@/lib/os-compiler";

const Body = z.object({ intent: z.string().min(5).max(2000) });

// POST /api/personal-os -> compile a desired identity into a personal OS (Pro-gated).
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "personal_os");
    const b = await parseBody(req, Body);
    return ok({ result: await compileOS(userId, b.intent) });
  });
}

// GET /api/personal-os -> recent compilations (open).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ compilations: await listCompilations(userId) });
  });
}
