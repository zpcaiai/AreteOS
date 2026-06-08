import { prisma } from "@/lib/db";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const cat = new URL(req.url).searchParams.get("category");
    const models = await prisma.cogModel.findMany({
      where: cat ? { category: cat as never } : undefined,
      orderBy: { name: "asc" },
    });
    return ok({ models });
  });
}
