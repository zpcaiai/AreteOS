import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { OrganizationalHealthCoach } from "@/lib/agents/registry";
import { organizationalHealthScore } from "@/lib/oikos/scoring";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const snapshots = await prisma.organizationalHealth.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 });
    return ok({ snapshots });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ signals: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await OrganizationalHealthCoach.run({ signals: b.signals });
    const c = out.scores;
    const snapshot = await prisma.organizationalHealth.create({ data: {
      userId, organizationId: b.organizationId ?? null,
      trust: c.trust, communication: c.communication, execution: c.execution, ownership: c.ownership,
      learning: c.learning, collaboration: c.collaboration, healthScore: organizationalHealthScore(c),
    } });
    return created({ snapshot, interventions: out.interventions });
  });
}
