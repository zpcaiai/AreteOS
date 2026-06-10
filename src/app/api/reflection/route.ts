import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, pagination, parseBody, route } from "@/lib/http";
import { ReflectionGuide } from "@/lib/agents/registry";
import { emit } from "@/lib/events";
import { recordProgress } from "@/lib/analytics";
import { memoryContext, remember } from "@/lib/memory";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const page = pagination(req, { limit: 30, max: 100 });
    const [reflections, total] = await Promise.all([
      prisma.reflection.findMany({
        where: { userId }, orderBy: { date: "desc" }, skip: page.skip, take: page.limit, include: { lessons: true },
      }),
      prisma.reflection.count({ where: { userId } }),
    ]);
    return ok({ reflections, pagination: { page: page.page, limit: page.limit, total } });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      worked: z.string().default(""), failed: z.string().default(""),
      learned: z.string().default(""), wrongAssumptions: z.string().default(""),
    }));
    const relevantMemory = await memoryContext(
      userId,
      `${body.worked}\n${body.failed}\n${body.learned}\n${body.wrongAssumptions}`,
      { kinds: ["REFLECTION", "DECISION", "HABIT", "SHADOW"], limit: 5 },
    );
    const guide = await ReflectionGuide.run({ ...body, memoryContext: relevantMemory });
    const reflection = await prisma.reflection.create({
      data: {
        userId, worked: body.worked, failed: body.failed, learned: body.learned,
        wrongAssumptions: body.wrongAssumptions, identityReinforced: guide.identityReinforced, depth: guide.depth,
        lessons: { create: guide.lessons.map((text) => ({ userId, text })) },
      },
      include: { lessons: true },
    });
    await emit({ userId, aggregateType: "Reflection", aggregateId: reflection.id, type: "ReflectionLogged", payload: { depth: guide.depth } });
    await remember({
      userId,
      kind: "REFLECTION",
      sourceType: "Reflection",
      sourceId: reflection.id,
      title: guide.nextFocus,
      content: `Worked: ${body.worked}\nFailed: ${body.failed}\nLearned: ${body.learned}\nWrong assumptions: ${body.wrongAssumptions}\nLessons: ${guide.lessons.join(" | ")}\nIdentity: ${guide.identityReinforced}`,
      metadata: { depth: guide.depth, nextFocus: guide.nextFocus },
      importance: guide.depth,
      occurredAt: reflection.date,
    }).catch(() => null);
    await recordProgress(userId).catch(() => null);
    return created({ reflection, nextFocus: guide.nextFocus });
  });
}
