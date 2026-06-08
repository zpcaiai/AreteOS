import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { FirstPrincipleCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const body = await parseBody(req, z.object({ problem: z.string().min(1), assumptions: z.array(z.string()).default([]) }));
    const out = await FirstPrincipleCoach.run(body);
    const map = await prisma.firstPrincipleMap.create({
      data: {
        userId, problem: body.problem, tree: out as object,
        assumptions: { create: out.assumptionsAssessed.map((a) => ({ userId, statement: a.statement, valid: a.valid })) },
        rootCauses: { create: out.rootCauses.map((cause, i) => ({ userId, cause, depth: i + 1 })) },
        constraints: { create: out.realConstraints.map((statement) => ({ userId, statement })) },
      },
      include: { assumptions: true, rootCauses: true, constraints: true },
    });
    return created({ map, zeroBasedDesign: out.zeroBasedDesign });
  });
}
