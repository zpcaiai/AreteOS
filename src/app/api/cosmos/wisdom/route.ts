import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { WisdomMentor } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const b = await parseBody(req, z.object({ reflections: z.array(z.string()).default([]), lessons: z.array(z.string()).default([]) }));
    const out = await WisdomMentor.run({ reflections: b.reflections, lessons: b.lessons });
    const principles = await prisma.$transaction(out.principles.map((p) =>
      prisma.lifePrinciple.create({ data: { userId, principle: p.principle, rationale: p.rationale } })));
    const philosophy = out.insights.length
      ? await prisma.personalPhilosophy.create({ data: { userId, philosophy: out.insights.map((i) => i.insight).join(" ") } })
      : null;
    return created({ principles, philosophy, insights: out.insights });
  });
}
