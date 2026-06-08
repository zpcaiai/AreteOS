import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { WisdomMentor } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [insights, principles] = await Promise.all([
      prisma.wisdomInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.personalPrinciple.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);
    return ok({ insights, principles });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]), lessons: z.array(z.string()).default([]) }));
    const out = await WisdomMentor.run({ reflections: b.reflections, lessons: b.lessons });
    const insights = await prisma.$transaction(out.insights.map((i) =>
      prisma.wisdomInsight.create({ data: { userId, insight: i.insight, basis: i.basis } })));
    const principles = await prisma.$transaction(out.principles.map((p) =>
      prisma.personalPrinciple.create({ data: { userId, principle: p.principle, rationale: p.rationale } })));
    return created({ insights, principles });
  });
}
