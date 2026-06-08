import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { OrganizationDesigner } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const designs = await prisma.organizationDesign.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return ok({ designs });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ context: z.array(z.string()).default([]), goal: z.string().optional(), title: z.string().default("Organization Blueprint"), organizationId: z.string().optional() }));
    const out = await OrganizationDesigner.run({ context: b.context, goal: b.goal });
    const design = await prisma.organizationDesign.create({ data: {
      userId, organizationId: b.organizationId ?? null, title: b.title, structure: out.structure,
      decisionRights: out.decisionRights, informationFlow: out.informationFlow, coordinationCost: out.coordinationCost,
      scalingRecommendations: out.scalingRecommendations, designScore: out.designScore,
    } });
    return created({ design });
  });
}
