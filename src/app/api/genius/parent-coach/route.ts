import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route, HttpError } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ParentCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "child");
    const b = await parseBody(req, z.object({ childId: z.string().min(1), context: z.array(z.string()).default([]), role: z.string().optional() }));
    if (!(await prisma.childProfile.findFirst({ where: { id: b.childId, userId } }))) throw new HttpError(404, "Child not found");
    const out = await ParentCoach.run({ context: b.context, role: b.role });
    const session = await prisma.parentCoachingSession.create({ data: {
      userId, childId: b.childId, role: out.role, guidance: out.guidance, conversationScripts: out.conversationScripts, supportScore: out.supportScore,
    } });
    return created({ session });
  });
}
