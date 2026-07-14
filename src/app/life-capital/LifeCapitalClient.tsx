"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { CAPITAL_CATEGORIES, type Bi } from "@/lib/capital-ledger-math";

interface Sheet { balances: Record<string, number>; global: number; diversification: number; weakest: string }
interface Analysis { summary: string; biggestStrength: string; biggestLeak: string; oneInvestment: string }

export default function LifeCapitalPage() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const sheet = useApi<Sheet>("/api/life-capital");
  const [category, setCategory] = useState(CAPITAL_CATEGORIES[0].key);
  const [entryType, setEntryType] = useState<"deposit" | "withdrawal">("deposit");
  const [amount, setAmount] = useState(15);
  const entry = useApiMutation<{ action: string; category: string; entryType: string; amount: number }, Sheet>("/api/life-capital", { invalidate: ["/api/life-capital"] });
  const analyze = useApiMutation<{ action: string }, { sheet: Sheet; analysis: Analysis }>("/api/life-capital");
  const d = sheet.data;

  return (
    <div>
      <PageHeader title={T("人生资本总账", "Life Capital Ledger")} subtitle={T("追踪决定长期生活质量的多种资本 —— 未被追踪的,往往正在流失。", "Track the capitals that determine long-term life quality — what's not tracked gets depleted.")} />
      <Card title={T("资本概览", "Capital overview")}>
        {d ? (
          <div className="flex flex-wrap items-end gap-8">
            <div><div className="text-xs text-slate-500">{T("全局资本分", "Global capital")}</div><div className="text-3xl font-bold tabular-nums">{Math.round(d.global)}</div></div>
            <div><div className="text-xs text-slate-500">{T("多样化", "Diversification")}</div><div className="text-3xl font-bold tabular-nums text-sky-300">{Math.round(d.diversification * 100)}%</div></div>
          </div>
        ) : <p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p>}
      </Card>

      <div className="mt-4">
        <Card title={T("记录一笔资本变动", "Record a capital entry")}>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
              {CAPITAL_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{L(c.name)}</option>)}
            </select>
            <select value={entryType} onChange={(e) => setEntryType(e.target.value as "deposit" | "withdrawal")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
              <option value="deposit">{T("存入", "Deposit")}</option>
              <option value="withdrawal">{T("支出", "Withdrawal")}</option>
            </select>
            <input type="range" min={1} max={50} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="accent-indigo-500" />
            <span className="tabular-nums text-slate-300">{amount}</span>
            <button onClick={() => entry.mutate({ action: "entry", category, entryType, amount })} disabled={entry.isPending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{T("记录", "Record")}</button>
            <button onClick={() => analyze.mutate({ action: "analyze" })} disabled={analyze.isPending}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-600 disabled:opacity-50">{analyze.isPending ? "…" : T("分析", "Analyze")}</button>
          </div>
          {entry.error && isUpgradeError(entry.error) && <div className="mt-3"><UpgradeNotice feature={T("人生资本总账", "Life Capital Ledger")} tier="Plus" /></div>}
        </Card>
      </div>

      {d && (
        <div className="mt-4">
          <Card title={T("资产负债表", "Balance sheet")}>
            {CAPITAL_CATEGORIES.map((c) => <ScoreBar key={c.key} label={L(c.name)} value={(d.balances[c.key] ?? 0) / 100} />)}
          </Card>
        </div>
      )}

      {analyze.data?.analysis && (
        <div className="mt-4">
          <Card title={T("分析", "Analysis")} accent="#f59e0b">
            <p className="text-sm text-slate-200">{analyze.data.analysis.summary}</p>
            <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{T("最大优势", "Strength")}:</span> {analyze.data.analysis.biggestStrength}</p>
            <p className="mt-1 text-sm text-rose-300/90"><span className="text-slate-500">{T("最大流失", "Leak")}:</span> {analyze.data.analysis.biggestLeak}</p>
            <p className="mt-1 text-sm text-sky-300"><span className="text-slate-500">{T("该投资", "Invest in")}:</span> {analyze.data.analysis.oneInvestment}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
