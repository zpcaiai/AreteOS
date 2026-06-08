import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const conflicts = await prisma.assumptionConflict.findMany({ where: { userId }, orderBy: { severity: "desc" } });
    return ok({ conflicts });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      valueOrGoal: z.string().min(1), assumption: z.string().min(1),
      conflict: z.string().default(""), severity: z.number().min(0).max(1).default(0.5), resolution: z.string().default(""),
    }));
    const conflict = await prisma.assumptionConflict.create({ data: { userId, ...b } });
    return created({ conflict });
  });
}
