import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [values, rankings, conflicts] = await Promise.all([
      prisma.value.findMany({ where: { userId } }),
      prisma.valueRanking.findMany({ where: { userId }, orderBy: { rank: "asc" }, include: { value: true } }),
      prisma.valueConflict.findMany({ where: { userId } }),
    ]);
    return ok({ values, rankings, conflicts });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      name: z.string().min(1), description: z.string().optional(), rank: z.number().int().optional(),
    }));
    const value = await prisma.value.create({ data: { userId, name: body.name, description: body.description ?? "" } });
    if (body.rank != null)
      await prisma.valueRanking.upsert({
        where: { userId_valueId: { userId, valueId: value.id } },
        update: { rank: body.rank }, create: { userId, valueId: value.id, rank: body.rank },
      });
    return created({ value });
  });
}
