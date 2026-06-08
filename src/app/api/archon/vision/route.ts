import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { ok, created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { VisionArchitect } from "@/lib/agents/registry";

export async function GET(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    const [vision, snapshots] = await Promise.all([
      prisma.visionStatement.findFirst({ where: { userId, active: true }, orderBy: { createdAt: "desc" } }),
      prisma.visionAlignmentSnapshot.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 60 }),
    ]);
    return ok({ vision, snapshots });
  });
}

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "leadership");
    const b = await parseBody(req, z.object({ mission: z.string().optional(), notes: z.array(z.string()).default([]), organizationId: z.string().optional() }));
    const out = await VisionArchitect.run({ mission: b.mission, notes: b.notes });
    await prisma.visionStatement.updateMany({ where: { userId, active: true }, data: { active: false } });
    const vision = await prisma.visionStatement.create({ data: {
      userId, organizationId: b.organizationId ?? null, statement: out.statement, communication: out.communication, alignmentScore: out.alignmentScore,
    } });
    await prisma.visionAlignmentSnapshot.create({ data: {
      userId, organizationId: b.organizationId ?? null, alignmentScore: out.alignmentScore,
      adoptionScore: out.alignmentScore, driftDetected: out.driftSignals.length > 0, notes: out.driftSignals.join(" · "),
    } });
    return created({ vision, driftSignals: out.driftSignals });
  });
}
