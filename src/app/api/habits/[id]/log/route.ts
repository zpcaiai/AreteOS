import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, notFound, parseBody, route } from "@/lib/http";
import { emit } from "@/lib/events";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const habit = await prisma.habit.findFirst({ where: { id, userId } });
    if (!habit) return notFound("Habit not found");
    const body = await parseBody(req, z.object({ done: z.boolean().default(true), identityNote: z.string().optional() }));
    const log = await prisma.habitLog.create({
      data: { habitId: habit.id, done: body.done, identityNote: body.identityNote ?? "" },
    });
    await emit({ userId, aggregateType: "Habit", aggregateId: habit.id, type: "HabitLogged", payload: { done: body.done } });
    return created({ log });
  });
}
