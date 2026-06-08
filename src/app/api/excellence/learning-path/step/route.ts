import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, notFound, parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ stepId: z.string().min(1), done: z.boolean().default(true) }));
    const step = await prisma.learningStep.findFirst({ where: { id: body.stepId, path: { userId } } });
    if (!step) return notFound("Step not found");
    const updated = await prisma.learningStep.update({
      where: { id: step.id }, data: { done: body.done, doneAt: body.done ? new Date() : null },
    });
    return ok({ step: updated });
  });
}
