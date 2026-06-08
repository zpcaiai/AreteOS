import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { KnowledgeArchitect } from "@/lib/agents/registry";
import { knowledgeWorkerScore } from "@/lib/oikos/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ subject: z.string().optional(), signals: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await KnowledgeArchitect.run({ subject: b.subject, signals: b.signals });
    const c = out.scores;
    const profile = await prisma.knowledgeWorkerProfile.create({ data: {
      userId, organizationId: b.organizationId ?? null, subject: b.subject ?? "",
      clarity: c.clarity, autonomy: c.autonomy, capability: c.capability, tooling: c.tooling, focus: c.focus,
      effectivenessScore: knowledgeWorkerScore(c), constraints: out.constraints,
    } });
    return created({ profile });
  });
}
