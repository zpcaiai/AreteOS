import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { projectMentalModel } from "@/lib/neo4j";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const models = await prisma.mentalModel.findMany({
      where: { userId }, include: { connectionsFrom: true, usageLogs: { take: 5, orderBy: { date: "desc" } } },
    });
    return ok({ models });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      name: z.string().min(1),
      category: z.enum(["ECONOMICS","PSYCHOLOGY","SYSTEMS","PROBABILITY","PHYSICS","BIOLOGY","STRATEGY","GENERAL"]).default("GENERAL"),
      description: z.string().optional(),
    }));
    const model = await prisma.mentalModel.upsert({
      where: { userId_name: { userId, name: body.name } },
      update: { category: body.category, description: body.description ?? "" },
      create: { userId, name: body.name, category: body.category, description: body.description ?? "" },
    });
    projectMentalModel({ userId, modelId: model.id, name: model.name, category: model.category }).catch(() => null);
    return created({ model });
  });
}
