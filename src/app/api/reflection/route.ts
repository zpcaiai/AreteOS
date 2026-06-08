import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { ReflectionGuide } from "@/lib/agents/registry";
import { emit } from "@/lib/events";
import { recordProgress } from "@/lib/analytics";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const reflections = await prisma.reflection.findMany({
      where: { userId }, orderBy: { date: "desc" }, take: 30, include: { lessons: true },
    });
    return ok({ reflections });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      worked: z.string().default(""), failed: z.string().default(""),
      learned: z.string().default(""), wrongAssumptions: z.string().default(""),
    }));
    const guide = await ReflectionGuide.run(body);
    const reflection = await prisma.reflection.create({
      data: {
        userId, worked: body.worked, failed: body.failed, learned: body.learned,
        wrongAssumptions: body.wrongAssumptions, identityReinforced: guide.identityReinforced, depth: guide.depth,
        lessons: { create: guide.lessons.map((text) => ({ userId, text })) },
      },
      include: { lessons: true },
    });
    await emit({ userId, aggregateType: "Reflection", aggregateId: reflection.id, type: "ReflectionLogged", payload: { depth: guide.depth } });
    await recordProgress(userId).catch(() => null);
    return created({ reflection, nextFocus: guide.nextFocus });
  });
}
