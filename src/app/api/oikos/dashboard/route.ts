import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
import { computeManagement } from "@/lib/oikos/service";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [health, profile, leverage, assets, governance, fragility, designs, twin] = await Promise.all([
      computeManagement(userId),
      prisma.managementProfile.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.leverageLog.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.mgmtKnowledgeAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 12 }),
      prisma.decisionGovernance.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.fragilityAssessment.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.organizationDesign.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.managementTwin.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ health, profile, leverage, assets, governance, fragility, designs, twin });
  });
}
