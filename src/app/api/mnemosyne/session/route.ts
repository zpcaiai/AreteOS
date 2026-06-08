import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const sessions = await prisma.listeningSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
    const totalSeconds = sessions.reduce((a, s) => a + s.seconds, 0);
    return ok({ sessions, totalSeconds, totalBooks: new Set(sessions.map((s) => s.bookId)).size });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ bookId: z.string().min(1), seconds: z.number().int().min(0).default(0) }));
    const session = await prisma.listeningSession.create({ data: { userId, bookId: b.bookId, seconds: b.seconds } });
    return created({ session });
  });
}
