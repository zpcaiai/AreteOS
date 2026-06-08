import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const mod = new URL(req.url).searchParams.get("module");
    const books = await prisma.audioBook.findMany({
      where: { AND: [ mod ? { relatedModule: mod } : {}, { OR: [{ sourceType: { in: ["CATALOG", "PUBLIC_DOMAIN"] } }, { ownerUserId: userId }] } ] },
      orderBy: [{ relatedModule: "asc" }, { title: "asc" }],
    });
    const progress = await prisma.listeningProgress.findMany({ where: { userId } });
    return ok({ books, progress });
  });
}
