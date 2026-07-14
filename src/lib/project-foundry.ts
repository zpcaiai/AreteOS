// Project Foundry DB service. Persists/reads blueprints & workspaces via event
// sourcing. Pure blueprint construction lives in project-foundry-blueprint.ts and is
// re-exported here for backward-compatible imports.

import { prisma } from "./db";
import { emit } from "./events";
import { FOUNDRY_FEATURES, STARTER_PACKS, WORKSPACE_TEMPLATES } from "./project-foundry-catalog";
import {
  buildProjectBlueprint,
  uniqueKnown,
  type ProjectBriefInput,
  type ProjectWorkspace,
} from "./project-foundry-blueprint";

export {
  buildProjectBlueprint,
  expandFeatureDependencies,
} from "./project-foundry-blueprint";
export type {
  ProjectBriefInput,
  ProjectBlueprint,
  ProjectWorkspace,
} from "./project-foundry-blueprint";

export async function createProjectBlueprint(userId: string, input: ProjectBriefInput) {
  const blueprint = buildProjectBlueprint(input);
  await emit({
    userId,
    aggregateType: "ProjectFoundry",
    aggregateId: blueprint.id,
    type: "ProjectBlueprintCreated",
    payload: blueprint,
  });
  return blueprint;
}

export async function listProjectBlueprints(userId: string, limit = 12) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "ProjectFoundry", type: "ProjectBlueprintCreated" },
    orderBy: { occurredAt: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
    select: { payload: true, occurredAt: true },
  });
  return rows.map((row) => ({ ...(row.payload as Record<string, unknown>), createdAt: row.occurredAt.getTime() }));
}

export async function saveProjectWorkspace(userId: string, input: Omit<ProjectWorkspace, "id" | "updatedAt"> & { id?: string }) {
  const workspace: ProjectWorkspace = {
    id: input.id || globalThis.crypto?.randomUUID?.() || `workspace_${Date.now()}`,
    templateId: input.templateId,
    title: input.title.trim(),
    problem: input.problem.trim(),
    audience: input.audience.trim(),
    projectType: input.projectType,
    selectedIds: uniqueKnown(input.selectedIds),
    constraints: input.constraints?.trim() ?? "",
    updatedAt: Date.now(),
  };
  await emit({
    userId,
    aggregateType: "ProjectFoundry",
    aggregateId: workspace.id,
    type: "ProjectWorkspaceSaved",
    payload: workspace,
  });
  return workspace;
}

/** Latest event per workspace is the editable current state; older events are its history. */
export async function listProjectWorkspaces(userId: string, limit = 24) {
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "ProjectFoundry", type: "ProjectWorkspaceSaved" },
    orderBy: { occurredAt: "desc" },
    take: 100,
    select: { payload: true, occurredAt: true },
  });
  const latest = new Map<string, ProjectWorkspace>();
  for (const row of rows) {
    const payload = row.payload as Partial<ProjectWorkspace>;
    if (!payload.id || latest.has(payload.id)) continue;
    latest.set(payload.id, { ...payload, id: payload.id, updatedAt: row.occurredAt.getTime() } as ProjectWorkspace);
    if (latest.size >= Math.min(Math.max(limit, 1), 50)) break;
  }
  return [...latest.values()];
}

export const projectFoundryCatalog = () => ({
  features: FOUNDRY_FEATURES,
  starterPacks: STARTER_PACKS,
  workspaceTemplates: WORKSPACE_TEMPLATES,
});
