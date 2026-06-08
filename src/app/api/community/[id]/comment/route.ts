import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, notFound, parseBody, route } from "@/lib/http";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return notFound("Post not found");
    const body = await parseBody(req, z.object({ content: z.string().min(1).max(1000) }));
    const comment = await prisma.postComment.create({ data: { postId: id, userId, content: body.content } });
    return created({ comment });
  });
}
