import { z } from "zod";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HttpError, ok, parseBody, requireSameOrigin, route } from "@/lib/http";
import { persistentRateLimit } from "@/lib/rate-limit";
import { track } from "@/lib/telemetry";

const Body = z.object({
  workspaceId: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  outcome: z.enum(["not_started", "in_progress", "useful", "not_useful"]),
  comment: z.string().trim().max(1000).default(""),
});

export async function POST(req: Request) {
  return route(async () => {
    requireSameOrigin(req);
    const userId = await getUserId(req);
    const limited = await persistentRateLimit({ key: `foundry-feedback:${userId}`, limit: 20, windowMs: 60_000 });
    if (limited) return limited;
    const body = await parseBody(req, Body);
    const workspace = await prisma.foundryWorkspace.findFirst({
      where: { id: body.workspaceId, OR: [{ ownerId: userId }, { team: { members: { some: { userId } } } }] },
      select: { id: true, templateId: true, templateVersion: true },
    });
    if (!workspace) throw new HttpError(404, "工作区不存在");
    if (!workspace.templateId) throw new HttpError(400, "只有从模板创建的工作区可以提交模板反馈");
    const feedback = await prisma.workspaceTemplateFeedback.upsert({
      where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
      update: { rating: body.rating, outcome: body.outcome, comment: body.comment },
      create: { userId, workspaceId: workspace.id, templateId: workspace.templateId, templateVersion: workspace.templateVersion, rating: body.rating, outcome: body.outcome, comment: body.comment },
    });
    await track({ userId, name: "foundry_template_feedback", props: { templateId: workspace.templateId, templateVersion: workspace.templateVersion, rating: body.rating, outcome: body.outcome } });
    return ok({ feedback: { id: feedback.id, updatedAt: feedback.updatedAt } });
  });
}
