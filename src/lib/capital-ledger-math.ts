// Life Capital Ledger — pure math over 12 capital categories. Each account starts
// at a neutral 50; deposits raise it, withdrawals lower it (clamped 0..100). The
// global score is the geometric mean (a neglected/depleted capital drags it down).
// No I/O imports; unit-testable.

import { clamp01, geoMean01, round1 } from "./skills-scoring";

export interface Bi { zh: string; en: string }
export interface CapitalCategory { key: string; name: Bi }

export const CAPITAL_CATEGORIES: CapitalCategory[] = [
  { key: "knowledge", name: { zh: "知识资本", en: "Knowledge" } },
  { key: "skill", name: { zh: "技能资本", en: "Skill" } },
  { key: "health", name: { zh: "健康资本", en: "Health" } },
  { key: "relationship", name: { zh: "关系资本", en: "Relationship" } },
  { key: "reputation", name: { zh: "声誉资本", en: "Reputation" } },
  { key: "asset", name: { zh: "资产资本", en: "Asset" } },
  { key: "financial", name: { zh: "财务资本", en: "Financial" } },
  { key: "freedom", name: { zh: "自由资本", en: "Freedom" } },
  { key: "judgment", name: { zh: "判断资本", en: "Judgment" } },
  { key: "meaning", name: { zh: "意义资本", en: "Meaning" } },
  { key: "attention", name: { zh: "注意力资本", en: "Attention" } },
  { key: "inner", name: { zh: "内在资本", en: "Inner" } },
];

export const CATEGORY_KEYS = CAPITAL_CATEGORIES.map((c) => c.key);
export type EntryType = "deposit" | "withdrawal";
export interface CapitalEntry { category: string; entryType: EntryType; amount: number }

const START = 50;
const clampBal = (x: number) => Math.min(100, Math.max(0, x));

/** Project entries into per-category balances (0..100, starting at 50). */
export function applyEntries(entries: CapitalEntry[]): Record<string, number> {
  const bal: Record<string, number> = {};
  for (const k of CATEGORY_KEYS) bal[k] = START;
  for (const e of entries) {
    if (!(e.category in bal)) continue;
    const delta = (e.entryType === "withdrawal" ? -1 : 1) * Math.max(0, e.amount);
    bal[e.category] = clampBal(bal[e.category] + delta);
  }
  return bal;
}

/** Global life-capital score 0..100 = geometric mean of balances (neglect tanks it). */
export function globalLifeCapitalScore(balances: Record<string, number>): number {
  const vals = CATEGORY_KEYS.map((k) => clamp01((balances[k] ?? 0) / 100));
  return round1(geoMean01(vals) * 100);
}

/** Diversification 0..1: 1 = perfectly even capital, lower = lopsided. */
export function diversification(balances: Record<string, number>): number {
  const vals = CATEGORY_KEYS.map((k) => balances[k] ?? 0);
  const mean = vals.reduce((s, x) => s + x, 0) / vals.length;
  const variance = vals.reduce((s, x) => s + (x - mean) ** 2, 0) / vals.length;
  return clamp01(1 - Math.sqrt(variance) / 50);
}

export function weakest(balances: Record<string, number>): string {
  return CATEGORY_KEYS.reduce((min, k) => ((balances[k] ?? 0) < (balances[min] ?? 0) ? k : min), CATEGORY_KEYS[0]);
}
