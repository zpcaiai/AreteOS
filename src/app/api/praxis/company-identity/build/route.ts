import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { CompanyIdentityBuilder } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "sfm");
    const body = await parseBody(req, z.object({
      founderProfile: z.string().optional(), mission: z.string().optional(),
      notes: z.array(z.string()).default([]), organizationId: z.string().optional(),
    }));
    const out = await CompanyIdentityBuilder.run(body);
    await prisma.companyIdentity.updateMany({ where: { userId, active: true }, data: { active: false } });
    const identity = await prisma.companyIdentity.create({ data: {
      userId, organizationId: body.organizationId ?? null, identityStatement: out.identityStatement,
      strategicPosition: out.strategicPosition, culturalIdentity: out.culturalIdentity,
      enemyToAvoid: out.enemyToAvoid, promiseToCustomer: out.promiseToCustomer, internalSelfImage: out.internalSelfImage,
    } });
    return created({ identity });
  });
}
