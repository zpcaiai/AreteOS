// Identity Evolution Tree service: evidence is event-sourced; progress + unlocks
// are projections over the catalog.

import { prisma } from "./db";
import { emit } from "./events";
import { IDENTITY_NODES, NODE_BY_KEY, isUnlocked, nodeProgress, type EvidenceCounts, type EvidenceKind, type IdentityTreeNode } from "./identity-tree-catalog";
import { IdentityQuestGenerator } from "./agents/identity-tree";

const NS = "IdentityTree";

export async function recordEvidence(userId: string, nodeKey: string, kind: EvidenceKind): Promise<{ ok: boolean }> {
  if (!NODE_BY_KEY[nodeKey]) return { ok: false };
  await emit({ userId, aggregateType: NS, aggregateId: nodeKey, type: "IdentityEvidence", payload: { nodeKey, kind } }).catch(() => {});
  return { ok: true };
}

async function evidenceByNode(userId: string): Promise<Record<string, EvidenceCounts>> {
  const rows = await prisma.domainEvent.findMany({ where: { userId, aggregateType: NS, type: "IdentityEvidence" }, select: { payload: true } });
  const map: Record<string, EvidenceCounts> = {};
  for (const r of rows) {
    const p = (r.payload ?? {}) as Record<string, unknown>;
    const key = String(p.nodeKey);
    if (!NODE_BY_KEY[key]) continue;
    const e = map[key] ?? { habits: 0, assets: 0, reflections: 0 };
    if (p.kind === "habit") e.habits += 1;
    else if (p.kind === "asset") e.assets += 1;
    else if (p.kind === "reflection") e.reflections += 1;
    map[key] = e;
  }
  return map;
}

export interface TreeNodeProgress extends IdentityTreeNode {
  evidence: EvidenceCounts;
  progress: number;
  unlocked: boolean;
}

export async function treeProgress(userId: string): Promise<TreeNodeProgress[]> {
  const ev = await evidenceByNode(userId);
  return IDENTITY_NODES.map((n) => {
    const evidence = ev[n.key] ?? { habits: 0, assets: 0, reflections: 0 };
    const progress = nodeProgress(evidence, n.req);
    return { ...n, evidence, progress, unlocked: isUnlocked(progress) };
  });
}

export async function generateQuest(node: string, level: number) {
  return IdentityQuestGenerator.run({ node, level });
}
