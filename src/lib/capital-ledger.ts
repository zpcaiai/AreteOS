// Life Capital Ledger service: each entry is a domain event; the balance sheet is
// a projection. Other engines can emit capital entries too.

import { prisma } from "./db";
import { emit } from "./events";
import { applyEntries, diversification, globalLifeCapitalScore, weakest, type CapitalEntry, type EntryType } from "./capital-ledger-math";
import { LifeCapitalAnalyst } from "./agents/capital-ledger";

const NS = "LifeCapital";

export async function recordEntry(userId: string, input: { category: string; entryType: EntryType; amount: number; description?: string; sourceEngine?: string }): Promise<{ ok: true }> {
  await emit({ userId, aggregateType: NS, aggregateId: input.category, type: "CapitalEntry", payload: { category: input.category, entryType: input.entryType, amount: input.amount, description: input.description ?? "", sourceEngine: input.sourceEngine ?? "manual" } }).catch(() => {});
  return { ok: true };
}

export interface BalanceSheet {
  balances: Record<string, number>;
  global: number;
  diversification: number;
  weakest: string;
}

export async function balanceSheet(userId: string): Promise<BalanceSheet> {
  const rows = await prisma.domainEvent.findMany({ where: { userId, aggregateType: NS, type: "CapitalEntry" }, orderBy: { occurredAt: "asc" }, select: { payload: true } });
  const entries: CapitalEntry[] = rows.map((r) => {
    const p = (r.payload ?? {}) as Record<string, unknown>;
    return { category: String(p.category), entryType: (p.entryType === "withdrawal" ? "withdrawal" : "deposit") as EntryType, amount: Number(p.amount) || 0 };
  });
  const balances = applyEntries(entries);
  return { balances, global: globalLifeCapitalScore(balances), diversification: diversification(balances), weakest: weakest(balances) };
}

export async function analyzeCapital(userId: string) {
  const sheet = await balanceSheet(userId);
  const analysis = await LifeCapitalAnalyst.run({ balances: sheet.balances, weakest: sheet.weakest, global: sheet.global });
  return { sheet, analysis };
}


/** Cumulative global life-capital score after each entry (oldest -> newest, last N). */
export async function capitalHistory(userId: string, points = 24): Promise<number[]> {
  const rows = await prisma.domainEvent.findMany({ where: { userId, aggregateType: NS, type: "CapitalEntry" }, orderBy: { occurredAt: "asc" }, select: { payload: true } });
  const running: CapitalEntry[] = [];
  const series: number[] = [];
  for (const r of rows) {
    const p = (r.payload ?? {}) as Record<string, unknown>;
    running.push({ category: String(p.category), entryType: (p.entryType === "withdrawal" ? "withdrawal" : "deposit") as EntryType, amount: Number(p.amount) || 0 });
    series.push(globalLifeCapitalScore(applyEntries(running)));
  }
  return series.slice(-points);
}
