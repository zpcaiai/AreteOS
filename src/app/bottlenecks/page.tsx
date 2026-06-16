"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { SIGNAL_RULES, BOTTLENECK_BY_KEY, type Bi } from "@/lib/bottleneck-rules";

interface Ranked { key: string; name: Bi; question: Bi; score: number; confidence: number }
interface Diagnosis { primaryBottleneck: string; secondaryBottlenecks: string[]; rootCause: string; confidence: number; recommendedNextEngine: string; recommendation: string }
interface Result { ranked: Ranked[]; diagnosis: Diagnosis }

export default function BottlenecksPage() {
  const { locale } = useI18n();
  const L = (b?: Bi) => (b ? (locale === "en" ? b.en : b.zh) : "");
  const T = useT();
  const [problem, setProblem] = useState("");
  const [signals, setSignals] = useState<Set<string>>(new Set());
  const [useEvidence, setUseEvidence] = useState(true);
  const run = useApiMutation<{ problemStatement: string; signals: string[]; useEvidence: boolean }, { result: Result }>("/api/bottlenecks");
  const r = run.data?.result;

  const toggle = (s: string) => setSignals((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  return (
    <div>
      <PageHeader title={T("瓶颈诊断", "Bottleneck Diagnosis")} subtitle={T("找到限制你成长的真正约束 —— 先诊断,再行动。", "Find the real constraint on your growth — diagnose before acting.")} />
      <Card title={T("你正在面对的成长问题", "Your current growth problem")}>
        <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={2}
          placeholder={T("例如:我读了很多,却从不产出任何东西。", "e.g. I read a lot but never publish anything.")}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200" />
        <div className="mt-3 text-xs text-slate-500">{T("勾选符合你的信号:", "Check the signals that fit you:")}</div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {SIGNAL_RULES.map((s) => (
            <label key={s.signal} className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={signals.has(s.signal)} onChange={() => toggle(s.signal)} className="accent-indigo-500" />
              {L(s.label)}
            </label>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <input type="checkbox" checked={useEvidence} onChange={(e) => setUseEvidence(e.target.checked)} className="accent-indigo-500" />
          {T("结合我的行为证据(言行差距自动补充信号)", "Use my behavioral evidence (auto-add signals from the identity-behavior gap)")}
        </label>
        <button onClick={() => run.mutate({ problemStatement: problem, signals: [...signals], useEvidence })} disabled={run.isPending}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? T("诊断中…", "Diagnosing…") : T("诊断", "Diagnose")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={T("瓶颈诊断", "Bottleneck Diagnosis")} tier="Plus" /></div>}

      {r && (
        <div className="mt-4 space-y-4">
          <Card title={T("诊断", "Diagnosis")} accent="#f59e0b">
            <p className="text-sm text-slate-200"><span className="text-slate-500">{T("主瓶颈", "Primary")}:</span> {L(BOTTLENECK_BY_KEY[r.diagnosis.primaryBottleneck]?.name) || r.diagnosis.primaryBottleneck}</p>
            <p className="mt-1 text-sm text-slate-300"><span className="text-slate-500">{T("根因", "Root cause")}:</span> {r.diagnosis.rootCause}</p>
            <p className="mt-1 text-sm text-emerald-300"><span className="text-slate-500">{T("建议", "Recommendation")}:</span> {r.diagnosis.recommendation}</p>
            <p className="mt-1 text-xs text-slate-500">{T("下一步引擎", "Next engine")}: {r.diagnosis.recommendedNextEngine}</p>
          </Card>
          {r.ranked.length > 0 && (
            <Card title={T("候选瓶颈排序", "Ranked candidates")}>
              {r.ranked.map((b) => <ScoreBar key={b.key} label={L(b.name)} value={b.confidence} />)}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
