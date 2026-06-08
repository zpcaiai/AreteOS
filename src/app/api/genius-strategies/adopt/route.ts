import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ strategyId: z.string().min(1) }));
    const adoption = await prisma.strategyAdoption.upsert({
      where: { userId_strategyId: { userId, strategyId: body.strategyId } },
      update: { status: "PRACTICING" },
      create: { userId, strategyId: body.strategyId, status: "ADOPTED" },
    });
    return created({ adoption });
  });
}
