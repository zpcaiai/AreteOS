import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { UncertaintyStrategist } from "@/lib/agents/registry";
import { uncertaintyScore } from "@/lib/phronesis/scoring";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ situation: z.string().min(1), context: z.array(z.string()).default([]) }));
    const out = await UncertaintyStrategist.run({ situation: b.situation, context: b.context });
    const c = out.scores;
    const assessment = await prisma.uncertaintyAssessment.create({ data: {
      userId, robustness: c.robustness, fragility: c.fragility, optionality: c.optionality,
      tailRiskAwareness: c.tailRiskAwareness, uncertaintyScore: uncertaintyScore(c), profile: out.profile,
    } });
    if (out.options.length) await prisma.$transaction(out.options.map((o) =>
      prisma.optionality.create({ data: { userId, option: o.option, upside: o.upside, cappedDownside: o.cappedDownside } })));
    if (out.tailRisks.length) await prisma.$transaction(out.tailRisks.map((t) =>
      prisma.tailRisk.create({ data: { userId, risk: t.risk, exposure: t.exposure, mitigation: t.mitigation } })));
    return created({ assessment, options: out.options, tailRisks: out.tailRisks });
  });
}
