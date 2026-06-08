import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, notFound, parseBody, route } from "@/lib/http";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      adoptionId: z.string().min(1),
      reflection: z.string().default(""),
      fidelity: z.number().min(0).max(1).default(0.5),
    }));
    const adoption = await prisma.strategyAdoption.findFirst({ where: { id: body.adoptionId, userId } });
    if (!adoption) return notFound("Adoption not found");
    const log = await prisma.geniusPracticeLog.create({
      data: { adoptionId: adoption.id, reflection: body.reflection, fidelity: body.fidelity },
    });
    // Mark integrated once practiced with high fidelity a few times.
    const count = await prisma.geniusPracticeLog.count({ where: { adoptionId: adoption.id, fidelity: { gte: 0.7 } } });
    if (count >= 5 && adoption.status !== "INTEGRATED") {
      await prisma.strategyAdoption.update({ where: { id: adoption.id }, data: { status: "INTEGRATED" } });
    }
    return created({ log });
  });
}
