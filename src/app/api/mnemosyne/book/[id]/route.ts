import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, notFound, route } from "@/lib/http";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return route(async () => {
    const userId = await getUserId(req);
    const { id } = await ctx.params;
    const book = await prisma.audioBook.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!book) return notFound("Book not found");
    // Spoken text: public-domain text or original summary. Copyrighted full text is never stored/served.
    const spokenText = book.textContent && book.textContent.length > 0 ? book.textContent : book.summary;
    const progress = await prisma.listeningProgress.findUnique({ where: { userId_bookId: { userId, bookId: book.id } } });
    return ok({ book, spokenText, progress });
  });
}
