import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { CreativityCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), idea: z.string().min(1) }));
    const child = await prisma.childProfile.findFirst({ where: { id: b.childId, userId } });
    if (!child) throw new HttpError(404, "Child not found");
    const out = await CreativityCoach.run({ idea: b.idea, age: child.age });
    const project = await prisma.creativityProject.create({ data: {
      childId: b.childId, title: b.idea, mode: "DREAMER",
      idea: out.dreamer.join(" · "), prototype: out.builder.join(" · "), reflection: out.critic.join(" · "), confidence: out.confidence,
    } });
    return created({ project, ...out });
  });
}
