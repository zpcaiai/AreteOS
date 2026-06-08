import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { computeScoresCached } from "@/lib/analytics";
import { DigitalTwinSimulator } from "@/lib/agents/registry";
import { requireFeature } from "@/lib/membership/service";

async function buildSnapshot(userId: string) {
  const [{ scores, stage }, mission, identity] = await Promise.all([
    computeScoresCached(userId),
    prisma.mission.findFirst({ where: { userId, active: true } }),
    prisma.identity.findFirst({ where: { userId, active: true } }),
  ]);
  return { stage: stage.current, mission: mission?.statement ?? null, identity: identity?.name ?? null, scores };
}

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const snapshot = await buildSnapshot(userId);
    const snapshotJson = snapshot as unknown as import("@prisma/client").Prisma.InputJsonValue;
    const profile = await prisma.digitalTwinProfile.upsert({
      where: { userId }, update: { snapshot: snapshotJson }, create: { userId, snapshot: snapshotJson },
    });
    const [insights, drifts] = await Promise.all([
      prisma.twinInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.driftPrediction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    ]);
    return ok({ profile, snapshot, insights, drifts });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "digital_twin"); // Pro-tier feature
    const body = await parseBody(req, z.object({ scenario: z.string().optional() }));
    const snapshot = await buildSnapshot(userId);
    const out = await DigitalTwinSimulator.run({ snapshot, scenario: body.scenario });
    await prisma.twinInsight.create({ data: { userId, insight: out.trajectory, basis: out.personality } });
    await prisma.driftPrediction.create({
      data: { userId, risk: out.driftRisk, towardIdentity: out.driftDirection, rationale: out.recommendation },
    });
    return created(out);
  });
}
