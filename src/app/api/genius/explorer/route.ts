import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ExplorerCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), interest: z.string().min(1) }));
    const child = await prisma.childProfile.findFirst({ where: { id: b.childId, userId } });
    if (!child) throw new HttpError(404, "Child not found");
    const out = await ExplorerCoach.run({ interest: b.interest, age: child.age });
    await prisma.$transaction([
      ...out.questions.map((q) => prisma.curiosityLog.create({ data: { childId: b.childId, question: q, topic: b.interest } })),
      ...out.experiments.map((e) => prisma.curiosityLog.create({ data: { childId: b.childId, experiment: e, topic: b.interest } })),
    ]);
    return created({ ...out });
  });
}
