import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      bookId: z.string().min(1), positionChar: z.number().int().min(0).default(0),
      percent: z.number().min(0).max(1).default(0), addSeconds: z.number().int().min(0).default(0),
      completed: z.boolean().default(false),
    }));
    const existing = await prisma.listeningProgress.findUnique({ where: { userId_bookId: { userId, bookId: b.bookId } } });
    const progress = await prisma.listeningProgress.upsert({
      where: { userId_bookId: { userId, bookId: b.bookId } },
      update: { positionChar: b.positionChar, percent: b.percent, completed: b.completed, totalSeconds: (existing?.totalSeconds ?? 0) + b.addSeconds },
      create: { userId, bookId: b.bookId, positionChar: b.positionChar, percent: b.percent, completed: b.completed, totalSeconds: b.addSeconds },
    });
    return ok({ progress });
  });
}
