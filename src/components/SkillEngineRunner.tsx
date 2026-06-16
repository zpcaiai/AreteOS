"use client";

// Generic, bilingual UI for every Skills-Library engine: self-rate the factors,
// optionally add context, run the coach, and see the score + guidance. One
// component powers all 20 engines (config comes from the catalog).

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import type { Bi, SkillEngine } from "@/lib/skills-catalog";

interface Guidance { summary: string; keyInsight: string; topActions: string[]; risk: string }
interface AssessResult { slug: string; score: number; factors: Record<string, number>; guidance: Guidance }

export default function SkillEngineRunner({ engine }: { engine: SkillEngine }) {
  const { locale } = useI18n();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const T = useT();

  const url = `/api/skills/${engine.slug}`;
  const latest = useApi<{ latest: AssessResult | null }>(url);
  const [factors, setFactors] = useState<Record<string, number>>({});
  const [context, setContext] = useState("");
  const run = useApiMutation<{ context: string; factors: Record<string, number> }, { assessment: AssessResult }>(url, { invalidate: [url] });

  const val = (k: string) => factors[k] ?? latest.data?.latest?.factors?.[k] ?? 0.5;
  const result = run.data?.assessment ?? latest.data?.latest ?? null;
  const tier = engine.tier === 2 ? "Pro" : "Plus";

  function assess() {
    const f: Record<string, number> = {};
    for (const ft of engine.factors) f[ft.key] = val(ft.key);
    run.mutate({ context, factors: f });
  }

  return (
    <div>
      <PageHeader title={L(engine.title)} subtitle={L(engine.subtitle)} />

      <Card title={T("自评因子", "Self-rate the factors")}>
        <div className="space-y-2.5">
          {engine.factors.map((ft) => (
            <div key={ft.key} className="flex items-center gap-3 text-sm">
              <label htmlFor={`sk-${ft.key}`} className="w-44 shrink-0 text-slate-400">{L(ft.label)}{ft.denom ? " ↓" : ""}</label>
              <input id={`sk-${ft.key}`} type="range" min={0} max={100} value={Math.round(val(ft.key) * 100)}
                onChange={(e) => setFactors((s) => ({ ...s, [ft.key]: Number(e.target.value) / 100 }))} className="flex-1 accent-indigo-500" />
              <span className="w-10 text-right tabular-nums text-slate-300">{Math.round(val(ft.key) * 100)}%</span>
            </div>
          ))}
        </div>
        <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder={T("情境(可选):你正在面对的具体情况…", "Context (optional): the specific situation you're in…")}
          rows={2} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200" />
        <button onClick={assess} disabled={run.isPending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? T("评估中…", "Assessing…") : T("评估", "Assess")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={L(engine.title)} tier={tier} /></div>}

      {result && (
        <div className="mt-4 space-y-4">
          <Card title={T("得分", "Score")}>
            <div className="text-4xl font-bold tabular-nums">{Math.round(result.score)}<span className="text-base text-slate-500"> / 100</span></div>
            <div className="mt-3">
              {engine.factors.map((ft) => <ScoreBar key={ft.key} label={L(ft.label)} value={result.factors[ft.key] ?? 0} />)}
            </div>
          </Card>
          {result.guidance?.summary && (
            <Card title={T("教练指导", "Coaching")} accent="#34d399">
              <p className="text-sm text-slate-200">{result.guidance.summary}</p>
              {result.guidance.keyInsight && <p className="mt-2 text-sm text-slate-300"><span className="text-slate-500">{T("关键洞察", "Key insight")}:</span> {result.guidance.keyInsight}</p>}
              {result.guidance.topActions?.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-slate-500">{T("下一步", "Top actions")}</div>
                  <ul className="mt-1 space-y-1 text-sm text-slate-300">{result.guidance.topActions.map((a, i) => <li key={i}>· {a}</li>)}</ul>
                </div>
              )}
              {result.guidance.risk && <p className="mt-2 text-sm text-amber-300/90"><span className="text-slate-500">{T("风险", "Risk")}:</span> {result.guidance.risk}</p>}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
