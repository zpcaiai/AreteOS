import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [missions, visions, lifeThemes, constitutions] = await Promise.all([
      prisma.mission.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.vision.findMany({ where: { userId } }),
      prisma.lifeTheme.findMany({ where: { userId } }),
      prisma.constitution.findMany({ where: { userId }, orderBy: { rank: "asc" } }),
    ]);
    return ok({ missions, visions, lifeThemes, constitutions });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      statement: z.string().min(3),
      vision: z.string().optional(),
      lifeThemes: z.array(z.string()).optional(),
    }));
    const mission = await prisma.mission.create({ data: { userId, statement: body.statement } });
    if (body.vision) await prisma.vision.create({ data: { userId, statement: body.vision } });
    if (body.lifeThemes?.length)
      await prisma.lifeTheme.createMany({ data: body.lifeThemes.map((name) => ({ userId, name })) });
    return created({ mission });
  });
}
