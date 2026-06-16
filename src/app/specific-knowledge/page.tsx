"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

type Kind = "curiosity" | "talent" | "experience" | "obsession" | "market";
interface Sig { label: string; kind: Kind; intensity: number; rarity: number }
interface Combo { a: string; b: string; defensibility: number; marketFit: number; score: number }
interface Asset { name: string; type: string; leverageType: string; firstStep: string }
interface Result {
  score: number; moat: number; market: number; signals: Sig[]; combos: Combo[];
  analysis: { rareCombinationStatement: string; unfairAdvantage: string; primaryDomain: string; topIntersections: string[] };
  opportunities: { assets: Asset[]; ninetyDayTarget: string };
}
const F = ["curiosityDepth", "experienceDepth", "skillRarity", "energy", "marketRelevance", "compoundingPotential"] as const;

function Graph({ signals, combos }: { signals: Sig[]; combos: Combo[] }) {
  if (signals.length < 2) return null;
  const W = 320, H = 260, cx = W / 2, cy = H / 2, R = 96;
  const pos = signals.map((s, i) => {
    const a = (i / signals.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), label: s.label };
  });
  const idx = (l: string) => signals.findIndex((s) => s.label === l);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Rare-combination graph">
      {combos.map((c, i) => {
        const a = pos[idx(c.a)], b = pos[idx(c.b)];
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#34d399" strokeOpacity={0.25 + c.score * 0.6} strokeWidth={1 + c.score * 5} />;
      })}
      {pos.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill="#a78bfa" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-slate-300" style={{ fontSize: 9 }}>{p.label.length > 16 ? p.label.slice(0, 15) + "…" : p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function SpecificKnowledgePage() {
  const { locale } = useI18n();
  const T = useT();
  const [signals, setSignals] = useState<Sig[]>([]);
  const [draft, setDraft] = useState<Sig>({ label: "", kind: "talent", intensity: 0.7, rarity: 0.6 });
  const [factors, setFactors] = useState<Record<string, number>>({});
  const [market, setMarket] = useState(0.6);
  const run = useApiMutation<{ factors: Record<string, number>; market: number; signals: Sig[] }, { result: Result }>("/api/specific-knowledge");
  const r = run.data?.result;
  const fval = (k: string) => factors[k] ?? 0.5;

  function assess() {
    const f = Object.fromEntries(F.map((k) => [k, fval(k)]));
    run.mutate({ factors: f, market, signals });
  }

  return (
    <div>
      <PageHeader title={T("独特知识 · 深度版", "Specific Knowledge · Flagship")} subtitle={T("找到你难以被复制的稀有交集,并把它变成可复利的资产。", "Find your hard-to-replicate intersection and turn it into compounding assets.")} />

      <Card title={T("你的信号", "Your signals")}>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder={T("信号(如:系统思维)", "signal (e.g. systems thinking)")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as Kind })} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
            {(["curiosity", "talent", "experience", "obsession", "market"] as Kind[]).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <span className="text-xs text-slate-500">{T("强度", "intensity")}</span><input type="range" min={0} max={100} value={Math.round(draft.intensity * 100)} onChange={(e) => setDraft({ ...draft, intensity: Number(e.target.value) / 100 })} className="accent-indigo-500" />
          <span className="text-xs text-slate-500">{T("稀有度", "rarity")}</span><input type="range" min={0} max={100} value={Math.round(draft.rarity * 100)} onChange={(e) => setDraft({ ...draft, rarity: Number(e.target.value) / 100 })} className="accent-indigo-500" />
          <button onClick={() => { if (draft.label.trim()) { setSignals([...signals, draft]); setDraft({ ...draft, label: "" }); } }} className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs hover:bg-slate-600">{T("添加", "Add")}</button>
        </div>
        {signals.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {signals.map((s, i) => <li key={i} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{s.label} <button onClick={() => setSignals(signals.filter((_, j) => j !== i))} className="text-slate-500 hover:text-rose-400">×</button></li>)}
          </ul>
        )}
      </Card>

      <div className="mt-4">
        <Card title={T("六因子自评", "Six factors")}>
          <div className="space-y-2">
            {F.map((k) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <label className="w-44 shrink-0 text-slate-400">{k}</label>
                <input type="range" min={0} max={100} value={Math.round(fval(k) * 100)} onChange={(e) => setFactors((s) => ({ ...s, [k]: Number(e.target.value) / 100 }))} className="flex-1 accent-indigo-500" />
                <span className="w-10 text-right tabular-nums text-slate-300">{Math.round(fval(k) * 100)}%</span>
              </div>
            ))}
            <div className="flex items-center gap-3 text-sm">
              <label className="w-44 shrink-0 text-slate-400">{T("市场相关性", "market relevance")}</label>
              <input type="range" min={0} max={100} value={Math.round(market * 100)} onChange={(e) => setMarket(Number(e.target.value) / 100)} className="flex-1 accent-indigo-500" />
              <span className="w-10 text-right tabular-nums text-slate-300">{Math.round(market * 100)}%</span>
            </div>
          </div>
          <button onClick={assess} disabled={run.isPending} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">{run.isPending ? T("分析中…", "Analyzing…") : T("分析", "Analyze")}</button>
          {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
        </Card>
      </div>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={T("独特知识 · 深度版", "Specific Knowledge · Flagship")} tier="Plus" /></div>}

      {r && (
        <div className="mt-4 space-y-4">
          <Card title={T("得分", "Score")}>
            <div className="flex flex-wrap items-end gap-8">
              <div><div className="text-xs text-slate-500">{T("独特知识分", "Specific Knowledge")}</div><div className="text-3xl font-bold tabular-nums">{Math.round(r.score)}</div></div>
              <div><div className="text-xs text-slate-500">{T("护城河(最强交集)", "Moat (top combo)")}</div><div className="text-3xl font-bold tabular-nums text-emerald-300">{Math.round(r.moat)}</div></div>
            </div>
          </Card>
          {r.signals.length >= 2 && (
            <Card title={T("稀有组合图谱", "Rare-combination graph")}>
              <Graph signals={r.signals} combos={r.combos} />
            </Card>
          )}
          <Card title={T("分析", "Analysis")} accent="#a78bfa">
            <p className="text-sm text-slate-200">{r.analysis.rareCombinationStatement}</p>
            <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{T("不公平优势", "Unfair advantage")}:</span> {r.analysis.unfairAdvantage}</p>
            <p className="mt-1 text-xs text-slate-500">{T("主领域", "Primary domain")}: {r.analysis.primaryDomain}</p>
          </Card>
          <Card title={T("资产机会", "Asset opportunities")} accent="#34d399">
            <ul className="space-y-2 text-sm text-slate-300">
              {r.opportunities.assets.map((a, i) => (
                <li key={i} className="border-t border-slate-800 pt-2 first:border-t-0 first:pt-0">
                  <div className="font-medium text-slate-200">{a.name} <span className="text-xs text-slate-500">({a.type} · {a.leverageType})</span></div>
                  <div className="text-xs text-slate-400">{T("第一步", "First step")}: {a.firstStep}</div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-sky-300"><span className="text-slate-500">{T("90 天目标", "90-day target")}:</span> {r.opportunities.ninetyDayTarget}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
