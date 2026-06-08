import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { CultureReplicator } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({
      founderIdentity: z.string().optional(), values: z.array(z.string()).default([]),
      behaviors: z.array(z.string()).default([]), organizationId: z.string().optional(),
    }));
    const out = await CultureReplicator.run({ founderIdentity: b.founderIdentity, values: b.values, behaviors: b.behaviors });
    const blueprint = await prisma.cultureBlueprint.create({ data: {
      userId, organizationId: b.organizationId ?? null, founderIdentity: b.founderIdentity ?? "",
      values: out.values, leadershipBehaviors: out.leadershipBehaviors, operatingPrinciples: out.operatingPrinciples,
      rituals: out.rituals, replicationPlaybook: out.replicationPlaybook,
    } });
    return created({ blueprint });
  });
}
