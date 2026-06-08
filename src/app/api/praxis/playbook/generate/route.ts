import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ReplicationPlaybookGenerator } from "@/lib/agents/registry";
import { computeOrgHealth } from "@/lib/praxis/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      successFactors: z.array(z.string()).default([]), bottlenecks: z.array(z.string()).default([]),
      title: z.string().default("Replication Playbook"), organizationId: z.string().optional(),
    }));
    const out = await ReplicationPlaybookGenerator.run({ successFactors: body.successFactors, bottlenecks: body.bottlenecks });
    const health = await computeOrgHealth(userId);
    const playbook = await prisma.replicationPlaybook.create({ data: {
      userId, organizationId: body.organizationId ?? null, title: body.title,
      transferPlan: out.transferPlan, hiringPlaybook: out.hiringPlaybook, onboardingPlaybook: out.onboardingPlaybook,
      culturePlaybook: out.culturePlaybook, decisionPlaybook: out.decisionPlaybook, scalingPlaybook: out.scalingPlaybook,
      readinessScore: health.replicationReadiness,
    } });
    const blueprint = await prisma.businessSystemBlueprint.create({ data: {
      userId, organizationId: body.organizationId ?? null, title: body.title,
      preserve: out.blueprint.preserve, standardize: out.blueprint.standardize, delegate: out.blueprint.delegate,
      automate: out.blueprint.automate, teach: out.blueprint.teach, measure: out.blueprint.measure, protect: out.blueprint.protect,
    } });
    return created({ playbook, blueprint, readiness: health.replicationReadiness });
  });
}
