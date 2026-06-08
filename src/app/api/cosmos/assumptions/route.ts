import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { AssumptionDetector } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ statements: z.array(z.string()).default([]) }));
    const out = await AssumptionDetector.run({ statements: b.statements });
    const assumptions = await prisma.$transaction(out.assumptions.map((a) =>
      prisma.assumption.create({ data: { userId, statement: a.assumption } })));
    return created({ assumptions, detail: out.assumptions });
  });
}
