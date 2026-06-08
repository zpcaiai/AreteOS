import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { computeWorldview } from "@/lib/cosmos/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, timeline] = await Promise.all([
      computeWorldview(userId),
      prisma.worldviewEvolution.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
    ]);
    return ok({ health, timeline });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      stage: z.enum(["INHERITED","QUESTIONED","CONSCIOUS","INTEGRATED","GENERATIVE","LEGACY"]), note: z.string().default(""),
    }));
    const entry = await prisma.worldviewEvolution.create({ data: { userId, stage: b.stage, note: b.note } });
    return created({ entry });
  });
}
