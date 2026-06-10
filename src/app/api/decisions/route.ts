import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, pagination, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const page = pagination(req);
    const [decisions, total] = await Promise.all([
      prisma.decision.findMany({
      where: { userId }, orderBy: { createdAt: "desc" },
      include: { options: true, reviews: { orderBy: { createdAt: "desc" } } },
      skip: page.skip, take: page.limit,
      }),
      prisma.decision.count({ where: { userId } }),
    ]);
    return ok({ decisions, pagination: { page: page.page, limit: page.limit, total } });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      title: z.string().min(1), context: z.string().optional(), options: z.array(z.string()).min(1),
    }));
    const decision = await prisma.decision.create({
      data: { userId, title: body.title, context: body.context ?? "", options: { create: body.options.map((label) => ({ label })) } },
      include: { options: true },
    });
    return created({ decision });
  });
}
