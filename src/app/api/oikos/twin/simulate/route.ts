import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { created, parseBody, route } from "@/lib/http";
import { requireFeature } from "@/lib/membership/service";
import { ManagementTwinSimulator } from "@/lib/agents/registry";
import { computeManagement } from "@/lib/oikos/service";

export async function POST(req: Request) {
  return route(async () => {
    const userId = await getUserId(req);
    await requireFeature(userId, "management");
    const b = await parseBody(req, z.object({ scenario: z.string().optional(), organizationId: z.string().optional() }));
    const snapshot = await computeManagement(userId);
    const out = await ManagementTwinSimulator.run({ snapshot: snapshot as unknown as Record<string, unknown>, scenario: b.scenario });
    const json = (v: unknown) => v as unknown as import("@prisma/client").Prisma.InputJsonValue;
    const twin = await prisma.managementTwin.create({ data: {
      userId, organizationId: b.organizationId ?? null, snapshot: json(snapshot), accuracyScore: out.accuracyScore,
    } });
    await prisma.organizationTwin.create({ data: {
      userId, organizationId: b.organizationId ?? null, snapshot: json(snapshot), simulationResults: json(out),
    } });
    return created({ twin, simulation: out });
  });
}
