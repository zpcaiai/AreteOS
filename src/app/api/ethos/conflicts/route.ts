import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { IdentityConflictAnalyzer } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    let { identities } = await parseBody(req, z.object({ identities: z.array(z.string()).default([]) }));
    if (identities.length === 0) {
      const stack = await prisma.userIdentityStack.findMany({ where: { userId, active: true } });
      identities = stack.map((s) => s.archetypeName);
    }
    const out = await IdentityConflictAnalyzer.run({ identities });
    const conflicts = await prisma.$transaction(out.conflicts.map((c) =>
      prisma.identityConflict.create({ data: {
        userId, identityA: c.identityA, identityB: c.identityB, tension: c.tension,
        tradeoffs: c.tradeoffs, integration: c.integration, severity: c.severity,
      } })));
    return created({ conflicts });
  });
}
