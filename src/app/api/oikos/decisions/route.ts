import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { DecisionGovernanceCoach } from "@/lib/agents/registry";
import { decisionGovernanceScore } from "@/lib/oikos/scoring";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const records = await prisma.decisionGovernance.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 });
    return ok({ records });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ decisions: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await DecisionGovernanceCoach.run({ decisions: b.decisions });
    const c = out.scores;
    const record = await prisma.decisionGovernance.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      quality: c.quality, consistency: c.consistency, speed: c.speed, ownership: c.ownership, learning: c.learning,
      governanceScore: decisionGovernanceScore(c), notes: out.report,
    } });
    return created({ record, upgrades: out.upgrades });
  });
}
