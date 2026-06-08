import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { RoleTransformationCoach } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ current: z.string().optional(), context: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await RoleTransformationCoach.run({ current: b.current, context: b.context });
    const plan = await prisma.leadershipGrowthPlan.create({ data: {
      userId, organizationId: b.organizationId ?? null, fromRole: out.currentRole, toRole: out.nextRole,
      steps: out.developmentPlan, successMetrics: out.successMetrics,
    } });
    return created({ plan, failureModes: out.failureModes });
  });
}
