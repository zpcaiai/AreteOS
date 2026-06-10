import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, pagination, parseBody, route } from "@/lib/http";
import { STATUS_KEYS } from "@/lib/community/statuses";

export async function GET(req: Request) {
  return route(async () => {
    await getUserId(req);
    const page = pagination(req);
    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" }, skip: page.skip, take: page.limit,
      include: {
        user: { select: { name: true, email: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true, email: true } } },
        },
      },
      }),
      prisma.communityPost.count(),
    ]);
    return ok({ posts, pagination: { page: page.page, limit: page.limit, total } });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      status: z.string().refine((s) => STATUS_KEYS.includes(s), "Unknown status"),
      message: z.string().max(2000).default(""),
    }));
    const post = await prisma.communityPost.create({ data: { userId, status: body.status, message: body.message } });
    return created({ post });
  });
}
