import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const habits = await prisma.habit.findMany({
      where: { userId }, orderBy: { createdAt: "desc" },
      include: { logs: { orderBy: { date: "desc" }, take: 30 }, identityLinks: true },
    });
    return ok({ habits });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      name: z.string().min(1), identityProof: z.string().optional(),
      targetPerWeek: z.number().int().min(1).max(21).optional(), identityId: z.string().optional(),
    }));
    const habit = await prisma.habit.create({
      data: {
        userId, name: body.name, identityProof: body.identityProof ?? "", targetPerWeek: body.targetPerWeek ?? 7,
        identityLinks: body.identityId ? { create: { identityId: body.identityId } } : undefined,
      },
    });
    return created({ habit });
  });
}
