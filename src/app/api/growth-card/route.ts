import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { generateWeeklyCard, latestWeeklyCard } from "@/lib/growth-card";

// GET /api/growth-card -> latest weekly card (open; user's own data).
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ latest: await latestWeeklyCard(userId) });
  });
}

// POST /api/growth-card -> generate this week's card now.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    return ok({ card: await generateWeeklyCard(userId) });
  });
}
