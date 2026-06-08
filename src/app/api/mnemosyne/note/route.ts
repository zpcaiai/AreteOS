import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const bookId = new URL(req.url).searchParams.get("bookId") ?? undefined;
    const notes = await prisma.bookNote.findMany({ where: { userId, ...(bookId ? { bookId } : {}) }, orderBy: { createdAt: "desc" } });
    return ok({ notes });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ bookId: z.string().min(1), note: z.string().min(1), positionChar: z.number().int().min(0).default(0) }));
    const note = await prisma.bookNote.create({ data: { userId, bookId: b.bookId, note: b.note, positionChar: b.positionChar } });
    return created({ note });
  });
}
