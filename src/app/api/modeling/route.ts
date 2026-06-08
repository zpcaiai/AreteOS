import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { ExcellenceModeler } from "@/lib/agents/registry";
import { projectRoleModel } from "@/lib/neo4j";

const ARCH = ["EINSTEIN","BUFFETT","DISNEY","JOBS","MUNGER","MUSK","DALIO","CUSTOM"] as const;

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ person: z.string().min(1), focus: z.string().optional() }));
    const bp = await ExcellenceModeler.run(body);
    const archetype = (ARCH as readonly string[]).includes(body.person.toUpperCase()) ? (body.person.toUpperCase() as typeof ARCH[number]) : "CUSTOM";
    const roleModel = await prisma.roleModel.create({
      data: {
        userId, person: body.person, archetype, values: bp.values.join(", "), beliefs: bp.beliefs.join("; "), environment: bp.environment,
        identityPatterns: { create: [{ pattern: bp.identity }] },
        decisionPatterns: { create: bp.decisionRules.map((rule) => ({ rule })) },
        habitPatterns: { create: bp.habits.map((habit) => ({ habit })) },
      },
      include: { identityPatterns: true, decisionPatterns: true, habitPatterns: true },
    });
    // Seed the latticework with the model's mental models.
    for (const name of bp.mentalModels) {
      await prisma.mentalModel.upsert({
        where: { userId_name: { userId, name } }, update: {}, create: { userId, name },
      });
    }
    projectRoleModel({ userId, person: body.person, mentalModels: bp.mentalModels }).catch(() => null);
    return created({ roleModel, blueprint: bp });
  });
}
