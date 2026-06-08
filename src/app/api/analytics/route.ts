import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, route } from "@/lib/http";
import { computeScoresCached, recordProgress } from "@/lib/analytics";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const result = await computeScoresCached(userId);
    const timeline = await prisma.scoreSnapshot.findMany({
      where: { userId, kind: "GROWTH" }, orderBy: { date: "asc" }, take: 90,
    });
    return ok({ ...result, timeline });
  });
}

// Snapshot today's scores + advance the personality stage if its gate clears.
export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const { scores, stage, transition } = await recordProgress(userId, { force: true });
    return created({ scores, stage, transition });
  });
}
