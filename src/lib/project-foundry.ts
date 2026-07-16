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
import { HttpError } from "./http";
import { requireTeamMember } from "./teams";

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

export async function saveProjectWorkspace(userId: string, input: Omit<ProjectWorkspace, "id" | "updatedAt" | "ownerId" | "teamName" | "revision" | "teamId"> & { id?: string; teamId?: string | null }) {
  const existing = input.id ? await prisma.foundryWorkspace.findUnique({ where: { id: input.id } }) : null;
  if (input.id && !existing) throw new HttpError(404, "工作区不存在");
  if (existing?.teamId) await requireTeamMember(existing.teamId, userId);
  else if (existing && existing.ownerId !== userId) throw new HttpError(403, "你无权修改该工作区");
  const teamId = input.teamId !== undefined ? input.teamId : existing?.teamId ?? null;
  if (teamId) await requireTeamMember(teamId, userId);
  if (existing && existing.teamId !== teamId && existing.ownerId !== userId) throw new HttpError(403, "只有工作区创建者可以改变共享范围");
  const saved = await prisma.foundryWorkspace.upsert({
    where: { id: input.id || "__new_workspace__" },
    update: {
      teamId, templateId: input.templateId, title: input.title.trim(), problem: input.problem.trim(), audience: input.audience.trim(),
      projectType: input.projectType, selectedIds: uniqueKnown(input.selectedIds), constraints: input.constraints?.trim() ?? "", revision: { increment: 1 },
    },
    create: {
      ownerId: userId, teamId, templateId: input.templateId, title: input.title.trim(), problem: input.problem.trim(), audience: input.audience.trim(),
      projectType: input.projectType, selectedIds: uniqueKnown(input.selectedIds), constraints: input.constraints?.trim() ?? "",
    },
    include: { team: { select: { name: true } } },
  });
  const workspace: ProjectWorkspace = {
    id: saved.id,
    templateId: input.templateId,
    title: input.title.trim(),
    problem: input.problem.trim(),
    audience: input.audience.trim(),
    projectType: input.projectType,
    selectedIds: saved.selectedIds as string[],
    constraints: input.constraints?.trim() ?? "",
    teamId: saved.teamId ?? undefined,
    teamName: saved.team?.name,
    ownerId: saved.ownerId,
    revision: saved.revision,
    updatedAt: saved.updatedAt.getTime(),
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
  const teamMemberships = await prisma.teamMember.findMany({ where: { userId, team: { status: "ACTIVE" } }, select: { teamId: true } });
  const durable = await prisma.foundryWorkspace.findMany({
    where: { OR: [{ ownerId: userId }, { teamId: { in: teamMemberships.map((membership) => membership.teamId) } }] },
    orderBy: { updatedAt: "desc" }, take: Math.min(Math.max(limit, 1), 50), include: { team: { select: { name: true } } },
  });
  const current = durable.map((row) => ({
    id: row.id, ownerId: row.ownerId, teamId: row.teamId ?? undefined, teamName: row.team?.name, templateId: row.templateId ?? undefined,
    title: row.title, problem: row.problem, audience: row.audience, projectType: row.projectType as ProjectWorkspace["projectType"],
    selectedIds: row.selectedIds as string[], constraints: row.constraints, revision: row.revision, updatedAt: row.updatedAt.getTime(),
  }));
  if (current.length >= Math.min(Math.max(limit, 1), 50)) return current;
  const rows = await prisma.domainEvent.findMany({
    where: { userId, aggregateType: "ProjectFoundry", type: "ProjectWorkspaceSaved" },
    orderBy: { occurredAt: "desc" },
    take: 100,
    select: { payload: true, occurredAt: true },
  });
  const latest = new Map<string, ProjectWorkspace>(current.map((workspace) => [workspace.id, workspace]));
  for (const row of rows) {
    const payload = row.payload as Partial<ProjectWorkspace>;
    if (!payload.id || latest.has(payload.id)) continue;
    latest.set(payload.id, { ...payload, id: payload.id, updatedAt: row.occurredAt.getTime() } as ProjectWorkspace);
    if (latest.size >= Math.min(Math.max(limit, 1), 50)) break;
  }
  return [...latest.values()].slice(0, Math.min(Math.max(limit, 1), 50));
}

export const projectFoundryCatalog = () => ({
  features: FOUNDRY_FEATURES,
  starterPacks: STARTER_PACKS,
  workspaceTemplates: WORKSPACE_TEMPLATES,
});
