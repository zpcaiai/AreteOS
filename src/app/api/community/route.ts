import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { STATUS_KEYS } from "@/lib/community/statuses";

export async function GET(req: Request) {
  return route(async () => {
    await getUserId(req);
    const url = new URL(req.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 30, 1), 100);
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" }, take: limit,
      include: {
        user: { select: { name: true, email: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });
    return ok({ posts });
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
