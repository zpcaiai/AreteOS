import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { nextAction } from "@/lib/next-action";

// GET /api/next-action -> the single next action to take (open; user's own data).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ next: await nextAction(userId) });
  });
}
