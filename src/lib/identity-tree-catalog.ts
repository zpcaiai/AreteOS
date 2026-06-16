// Identity Evolution Tree — node catalog + pure progress math. Identity evolves
// through evidence (habits, assets, reflections); a node unlocks the next when its
// requirements are met. Pure data + functions; no I/O.

export interface Bi { zh: string; en: string }
export interface NodeReq { habits: number; assets: number; reflections: number }
export interface IdentityTreeNode {
  key: string;
  name: Bi;
  family: string;
  level: number;
  next: string[];
  req: NodeReq;
}

const N = (key: string, zh: string, en: string, family: string, level: number, next: string[], req: NodeReq): IdentityTreeNode =>
  ({ key, name: { zh, en }, family, level, next, req });

export const IDENTITY_NODES: IdentityTreeNode[] = [
  // Builder path
  N("explorer", "探索者", "Explorer", "builder", 1, ["researcher"], { habits: 2, assets: 1, reflections: 1 }),
  N("researcher", "研究者", "Researcher", "builder", 2, ["systems_thinker"], { habits: 3, assets: 2, reflections: 2 }),
  N("systems_thinker", "系统思考者", "Systems Thinker", "builder", 3, ["architect"], { habits: 3, assets: 3, reflections: 2 }),
  N("architect", "架构师", "Architect", "builder", 4, ["builder"], { habits: 4, assets: 3, reflections: 3 }),
  N("builder", "建造者", "Builder", "builder", 5, ["founder"], { habits: 4, assets: 4, reflections: 3 }),
  N("founder", "创业者", "Founder", "builder", 6, ["leader"], { habits: 5, assets: 5, reflections: 4 }),
  N("leader", "领导者", "Leader", "builder", 7, ["mentor"], { habits: 5, assets: 5, reflections: 5 }),
  N("mentor", "导师", "Mentor", "builder", 8, [], { habits: 6, assets: 6, reflections: 6 }),
  // Mastery path
  N("learner", "学习者", "Learner", "mastery", 1, ["practitioner"], { habits: 2, assets: 1, reflections: 1 }),
  N("practitioner", "实践者", "Practitioner", "mastery", 2, ["craftsman"], { habits: 3, assets: 2, reflections: 2 }),
  N("craftsman", "匠人", "Craftsman", "mastery", 3, ["expert"], { habits: 4, assets: 3, reflections: 2 }),
  N("expert", "专家", "Expert", "mastery", 4, ["master"], { habits: 4, assets: 4, reflections: 3 }),
  N("master", "大师", "Master", "mastery", 5, ["teacher"], { habits: 5, assets: 5, reflections: 4 }),
  N("teacher", "教师", "Teacher", "mastery", 6, [], { habits: 5, assets: 5, reflections: 5 }),
];

export const NODE_BY_KEY: Record<string, IdentityTreeNode> = Object.fromEntries(IDENTITY_NODES.map((n) => [n.key, n]));

export type EvidenceKind = "habit" | "asset" | "reflection";
export interface EvidenceCounts { habits: number; assets: number; reflections: number }

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Node progress 0..1 = mean of (evidence/required) across required dimensions. */
export function nodeProgress(ev: EvidenceCounts, req: NodeReq): number {
  const parts: number[] = [];
  if (req.habits > 0) parts.push(clamp01(ev.habits / req.habits));
  if (req.assets > 0) parts.push(clamp01(ev.assets / req.assets));
  if (req.reflections > 0) parts.push(clamp01(ev.reflections / req.reflections));
  if (parts.length === 0) return 1;
  return clamp01(parts.reduce((s, x) => s + x, 0) / parts.length);
}

export function isUnlocked(progress: number): boolean {
  return progress >= 1 - 1e-9;
}

/** Follow `next` from a start node to produce a linear path of keys. */
export function pathFrom(startKey: string): string[] {
  const path: string[] = [];
  let cur: string | undefined = startKey;
  const seen = new Set<string>();
  while (cur && NODE_BY_KEY[cur] && !seen.has(cur)) {
    path.push(cur);
    seen.add(cur);
    cur = NODE_BY_KEY[cur].next[0];
  }
  return path;
}
