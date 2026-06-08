import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { projectIdentityGraph } from "@/lib/neo4j";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const identities = await prisma.identity.findMany({
      where: { userId },
      include: { roles: true, scores: { orderBy: { date: "desc" }, take: 1 } },
    });
    return ok({ identities });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({
      name: z.string().min(1),
      statement: z.string().optional(),
      clarity: z.number().min(0).max(1).optional(),
      roles: z.array(z.string()).optional(),
    }));
    const identity = await prisma.identity.create({
      data: {
        userId, name: body.name, statement: body.statement ?? "", clarity: body.clarity ?? 0.5,
        roles: body.roles?.length ? { create: body.roles.map((name) => ({ userId, name })) } : undefined,
      },
      include: { roles: true },
    });
    const mission = await prisma.mission.findFirst({ where: { userId, active: true } });
    projectIdentityGraph({ userId, identityId: identity.id, identityName: identity.name, missionStatement: mission?.statement }).catch(() => null);
    return created({ identity });
  });
}
