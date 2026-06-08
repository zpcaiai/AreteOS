import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const skills = await prisma.skill.findMany({ where: { userId }, include: { masteryLevel: true, progress: { take: 5, orderBy: { date: "desc" } } } });
    return ok({ skills });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      name: z.string().min(1), domain: z.string().optional(),
      knowledge: z.number().min(0).max(1).optional(), execution: z.number().min(0).max(1).optional(),
      problemSolving: z.number().min(0).max(1).optional(), teaching: z.number().min(0).max(1).optional(),
    }));
    const skill = await prisma.skill.create({
      data: {
        userId, name: body.name, domain: body.domain ?? "",
        masteryLevel: { create: { knowledge: body.knowledge ?? 0, execution: body.execution ?? 0, problemSolving: body.problemSolving ?? 0, teaching: body.teaching ?? 0 } },
      },
      include: { masteryLevel: true },
    });
    return created({ skill });
  });
}
