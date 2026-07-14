"use client";

// Life-outcome self-report. Capture a periodic check-in across real life dimensions,
// then see the change vs your personal baseline. Longitudinal evidence of change is the
// most defensible value a development product can show — more than any single score.

import { useMemo, useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { OUTCOME_DIMENSIONS, type Bi } from "@/lib/self-report-catalog";

interface MetricProgress { metric: string; baseline: number; latest: number; delta: number; checkins: number }
interface SeriesPoint { metric: string; value: number; at: number }
interface Progress { hasBaseline: boolean; totalCheckins: number; lastCheckinAt: number | null; metrics: MetricProgress[]; series: SeriesPoint[] }

export default function OutcomesClient() {
  const { locale } = useI18n();
  const T = useT();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const q = useApi<Progress>("/api/self-report");
  const save = useApiMutation<{ ratings: Record<string, number>; note?: string }, { progress: Progress }>(
    "/api/self-report",
    { invalidate: ["/api/self-report"] },
  );

  const [ratings, setRatings] = useState<Record<string, number>>(
    () => Object.fromEntries(OUTCOME_DIMENSIONS.map((d) => [d.key, 5])),
  );
  const [note, setNote] = useState("");
  const set = (k: string, v: number) => setRatings((r) => ({ ...r, [k]: v }));

  const prog = q.data;
  const byMetric = useMemo(() => {
    const m: Record<string, MetricProgress> = {};
    for (const x of prog?.metrics ?? []) m[x.metric] = x;
    return m;
  }, [prog]);
  const seriesFor = (metric: string) => (prog?.series ?? []).filter((s) => s.metric === metric).map((s) => s.value);

  return (
    <div>
      <PageHeader
        title={T("人生成果 · 基线与自评", "Life Outcomes · baseline & self-report")}
        subtitle={T("定期给真实生活打分，看它相对你的基线如何变化。改变的证据，比任何单一分数都更有价值。", "Rate real life periodically and watch it move vs your baseline. Evidence of change beats any single score.")}
      />

      <Card title={T("本次自评（0–10）", "This check-in (0–10)")}>
        <div className="space-y-3">
          {OUTCOME_DIMENSIONS.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <div className="w-40 shrink-0">
                <div className="text-sm text-slate-200">{L(d.name)}</div>
                <div className="text-[11px] text-slate-500">{L(d.help)}</div>
              </div>
              <input
                type="range" min={0} max={10} value={ratings[d.key]}
                onChange={(e) => set(d.key, Number(e.target.value))}
                aria-label={L(d.name)} className="flex-1 accent-indigo-500"
              />
              <span className="w-6 text-right tabular-nums text-slate-300">{ratings[d.key]}</span>
            </div>
          ))}
        </div>
        <textarea
          value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          placeholder={T("可选：这段时间发生了什么？", "Optional: what happened this period?")}
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => save.mutate({ ratings, note: note || undefined })}
            disabled={save.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {save.isPending ? "…" : prog?.hasBaseline ? T("记录自评", "Save check-in") : T("设定基线", "Set baseline")}
          </button>
          {prog?.totalCheckins ? (
            <span className="text-xs text-slate-500">{T("已记录", "Logged")} {prog.totalCheckins} {T("次", "check-ins")}</span>
          ) : null}
        </div>
      </Card>

      <div className="mt-4">
        <Card title={T("相对基线的变化", "Change vs baseline")} accent="#10b981">
          {q.isPending ? (
            <p className="text-sm text-slate-500">{T("加载中…", "Loading…")}</p>
          ) : prog?.hasBaseline ? (
            <div className="space-y-2">
              {OUTCOME_DIMENSIONS.map((d) => {
                const m = byMetric[d.key];
                if (!m) return null;
                const s = seriesFor(d.key);
                const up = m.delta > 0, down = m.delta < 0;
                return (
                  <div key={d.key} className="flex items-center gap-3 border-t border-slate-800 pt-2">
                    <div className="w-40 shrink-0 text-sm text-slate-300">{L(d.name)}</div>
                    <div className="flex flex-1 items-end gap-0.5" aria-hidden="true">
                      {s.map((v, i) => (
                        <div key={i} title={String(v)} style={{ height: `${4 + v * 2}px` }} className="w-1.5 rounded-sm bg-indigo-500/60" />
                      ))}
                    </div>
                    <div className="w-28 text-right text-sm tabular-nums">
                      <span className="text-slate-500">{m.baseline}</span>
                      <span className="text-slate-600"> → </span>
                      <span className="text-slate-200">{m.latest}</span>
                      <span className={`ml-1 text-xs ${up ? "text-emerald-400" : down ? "text-rose-400" : "text-slate-500"}`}>
                        {up ? "▲" : down ? "▼" : "—"}{m.delta !== 0 ? Math.abs(m.delta) : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{T("先记录一次自评来设定基线。之后每次自评都会显示相对基线的变化。", "Set a baseline with your first check-in. Every check-in after shows change vs baseline.")}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
