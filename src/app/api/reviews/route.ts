import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, pagination, parseBody, route } from "@/lib/http";
import { generateReview } from "@/lib/reviews";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || undefined;
    const page = pagination(req, { limit: 30, max: 100 });
    const where = { userId, ...(period ? { period: period as never } : {}) };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
      where: { userId, ...(period ? { period: period as never } : {}) },
      orderBy: { createdAt: "desc" }, skip: page.skip, take: page.limit,
      }),
      prisma.review.count({ where }),
    ]);
    return ok({ reviews, pagination: { page: page.page, limit: page.limit, total } });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ period: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY"]) }));
    const review = await generateReview(userId, body.period);
    return created({ review });
  });
}
