import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { KnowledgeExtractor } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ topic: z.string().min(1), notes: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await KnowledgeExtractor.run({ topic: b.topic, notes: b.notes });
    const org = b.organizationId ?? null;
    const asset = await prisma.mgmtKnowledgeAsset.create({ data: {
      userId, organizationId: org, kind: out.assetKind, title: out.title,
      content: out.heuristics.join("\n"), tacitSource: b.topic,
    } });
    const playbook = await prisma.playbook.create({ data: {
      userId, organizationId: org, title: out.title, steps: out.playbookSteps, whenToUse: out.whenToUse,
    } });
    const prompts = out.prompts.length
      ? await prisma.promptLibrary.create({ data: { userId, organizationId: org, title: `${out.title} prompts`, prompts: out.prompts, domain: b.topic } })
      : null;
    return created({ asset, playbook, prompts });
  });
}
