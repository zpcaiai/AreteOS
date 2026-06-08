import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, route } from "@/lib/http";
export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [assets, playbooks, prompts, workers] = await Promise.all([
      prisma.mgmtKnowledgeAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.playbook.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.promptLibrary.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.knowledgeWorkerProfile.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);
    return ok({ assets, playbooks, prompts, workers });
  });
}
