// Growth Prescription service: template + AI personalization, persisted as events.

import { prisma } from "./db";
import { emit } from "./events";
import { prescriptionFor, type PrescriptionTemplate } from "./prescription-templates";
import { PrescriptionGenerator } from "./agents/prescription";

export interface PrescriptionResult {
  bottleneck: string;
  template: PrescriptionTemplate;
  prescription: Awaited<ReturnType<typeof PrescriptionGenerator.run>>;
}

export async function generatePrescription(
  userId: string,
  input: { bottleneck: string; context?: string },
): Promise<PrescriptionResult | null> {
  const template = prescriptionFor(input.bottleneck);
  if (!template) return null;
  const prescription = await PrescriptionGenerator.run({
    bottleneck: input.bottleneck,
    context: input.context ?? "",
    objective: template.objective,
    sevenDay: template.sevenDay,
    thirtyDay: template.thirtyDay,
  });

  await emit({
    userId,
    aggregateType: "Prescription",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `rx_${Date.now()}`,
    type: "PrescriptionGenerated",
    payload: { bottleneck: input.bottleneck, title: prescription.title, firstAction: prescription.firstAction, sevenDay: prescription.sevenDay, thirtyDay: prescription.thirtyDay, metrics: prescription.metrics, linkedEngines: template.linkedEngines },
  }).catch(() => {});

  return { bottleneck: input.bottleneck, template, prescription };
}

export async function listPrescriptions(userId: string, limit = 20) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "Prescription", type: "PrescriptionGenerated" },
    orderBy: { occurredAt: "desc" },
    take: Math.min(Math.max(limit, 1), 100),
    select: { payload: true, occurredAt: true },
  });
  return rows.map((r) => ({ ...(r.payload as Record<string, unknown>), at: r.occurredAt.getTime() }));
}
