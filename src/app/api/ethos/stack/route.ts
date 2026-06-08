import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { IdentityStackBuilder } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const stack = await prisma.userIdentityStack.findMany({ where: { userId, active: true }, orderBy: { createdAt: "asc" } });
    return ok({ stack });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({
      mission: z.string().optional(), values: z.array(z.string()).default([]),
      strengths: z.array(z.string()).default([]), current: z.array(z.string()).default([]),
    }));
    const out = await IdentityStackBuilder.run(b);
    await prisma.userIdentityStack.updateMany({ where: { userId, active: true }, data: { active: false } });
    const stack = await prisma.$transaction(out.stack.map((i) =>
      prisma.userIdentityStack.create({ data: {
        userId, role: i.role, archetypeSlug: i.archetype.toLowerCase().replace(/\s+/g, "-"),
        archetypeName: i.archetype, stage: i.stage,
      } })));
    await prisma.$transaction(out.stack.map((i) =>
      prisma.identityEvolutionSnapshot.create({ data: {
        userId, archetypeSlug: i.archetype.toLowerCase().replace(/\s+/g, "-"), stage: i.stage, note: i.why,
      } })));
    return created({ stack });
  });
}
