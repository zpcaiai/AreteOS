import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { StrategicDiagnostician } from "@/lib/agents/registry";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "cognitive");
    const b = await parseBody(req, z.object({ problem: z.string().min(1), context: z.array(z.string()).default([]) }));
    const out = await StrategicDiagnostician.run({ problem: b.problem, context: b.context });
    const diagnosis = await prisma.diagnosis.create({ data: { userId, problem: b.problem, diagnosis: out.diagnosis } });
    await prisma.$transaction(out.rootCauses.map((r) =>
      prisma.cogRootCause.create({ data: { diagnosisId: diagnosis.id, rootCause: r } })));
    if (out.leveragePoints.length) await prisma.$transaction(out.leveragePoints.map((l) =>
      prisma.leveragePoint.create({ data: { diagnosisId: diagnosis.id, leverage: l.leverage, impact: l.impact } })));
    return created({ diagnosis, rootCauses: out.rootCauses, constraints: out.constraints, leveragePoints: out.leveragePoints });
  });
}
