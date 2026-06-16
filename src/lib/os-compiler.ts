// Personal OS Compiler service: route intent to a template, synthesize the full OS,
// persist as a versioned domain event.

import { prisma } from "./db";
import { emit } from "./events";
import { pickTemplate } from "./os-compiler-templates";
import { PersonalOSSynthesizer } from "./agents/os-compiler";

export interface CompileResult {
  version: number;
  template: string;
  os: Awaited<ReturnType<typeof PersonalOSSynthesizer.run>>;
}

export async function compileOS(userId: string, intent: string): Promise<CompileResult> {
  const t = pickTemplate(intent);
  const prior = await prisma.domainEvent.count({ where: { userId, aggregateType: "PersonalOS", type: "OSCompiled" } });
  const version = prior + 1;

  const os = await PersonalOSSynthesizer.run({
    intent,
    templateName: t.name,
    identityStack: t.identityStack,
    values: t.values,
    skills: t.skills,
    habits: t.habits,
    decisionRules: t.decisionRules,
    ninetyDay: t.ninetyDay,
  });

  await emit({
    userId,
    aggregateType: "PersonalOS",
    aggregateId: globalThis.crypto?.randomUUID?.() ?? `os_${Date.now()}`,
    type: "OSCompiled",
    payload: { intent, version, template: t.key, mission: os.mission, identityStack: os.identityStack },
  }).catch(() => {});

  return { version, template: t.key, os };
}

export async function listCompilations(userId: string, limit = 20) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "PersonalOS", type: "OSCompiled" },
    orderBy: { occurredAt: "desc" },
    take: Math.min(Math.max(limit, 1), 100),
    select: { payload: true, occurredAt: true },
  });
  return rows.map((r) => ({ ...(r.payload as Record<string, unknown>), at: r.occurredAt.getTime() }));
}
