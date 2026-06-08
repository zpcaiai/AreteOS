import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ProblemSolvingCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), problem: z.string().min(1) }));
    const child = await prisma.childProfile.findFirst({ where: { id: b.childId, userId } });
    if (!child) throw new HttpError(404, "Child not found");
    const out = await ProblemSolvingCoach.run({ problem: b.problem, age: child.age });
    const log = await prisma.problemSolvingLog.create({ data: {
      childId: b.childId, problem: b.problem, observation: out.observe, hypothesis: out.hypothesis,
      experiment: out.experiment, reflection: out.reflect, score: out.score,
    } });
    return created({ log, steps: out });
  });
}
