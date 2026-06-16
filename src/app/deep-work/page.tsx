"use client";

import { useEffect, useRef, useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface Heat { date: string; minutes: number; sessions: number; score: number }
interface Dashboard { totalSessions: number; totalMinutes: number; consistency: number; focusDepth: number; distractionControl: number; cognitiveDifficulty: number; outputValue: number; global: number; heatmap: Heat[]; weekly: { weekStart: string; minutes: number; sessions: number; avgScore: number }[] }
interface Review { focusVerdict: string; topDistraction: string; oneAdjustment: string }

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const heatColor = (min: number) => (min === 0 ? "#1e293b" : `hsl(${Math.min(140, 90 + min)} 60% ${30 + Math.min(30, min / 4)}%)`);

export default function DeepWorkPage() {
  const { locale } = useI18n();
  const T = useT();
  const dash = useApi<{ dashboard: Dashboard }>("/api/deep-work");
  const save = useApiMutation<{ action: string; durationMin: number; distractions: number; difficulty: number; outputQuality: number }, { dashboard: Dashboard; review: Review }>("/api/deep-work", { invalidate: ["/api/deep-work"] });

  const [phase, setPhase] = useState<"idle" | "running" | "review">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [distractions, setDistractions] = useState(0);
  const [difficulty, setDifficulty] = useState(0.7);
  const [output, setOutput] = useState(0.6);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function start() { setElapsed(0); setDistractions(0); setPhase("running"); timer.current = setInterval(() => setElapsed((e) => e + 1), 1000); }
  function stop() { if (timer.current) clearInterval(timer.current); setPhase("review"); }
  function reset() { setPhase("idle"); setElapsed(0); setDistractions(0); }
  function commit() {
    save.mutate({ action: "session", durationMin: Math.max(1, Math.round(elapsed / 60)), distractions, difficulty, outputQuality: output });
    reset();
  }
  const d = save.data?.dashboard ?? dash.data?.dashboard;
  const review = save.data?.review;

  return (
    <div>
      <PageHeader title={T("深度工作 · 深度版", "Deep Work · Flagship")} subtitle={T("受保护的注意力 × 认知难度 × 低分心 × 有价值的产出。", "Protected attention × cognitive difficulty × low distraction × valuable output.")} />

      <Card title={T("专注计时器", "Focus timer")}>
        <div className="flex items-center gap-6">
          <div className="text-5xl font-bold tabular-nums text-slate-100">{mmss(elapsed)}</div>
          <div className="text-sm text-slate-400">{T("分心次数", "Distractions")}: <span className="tabular-nums text-rose-300">{distractions}</span></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {phase === "idle" && <button onClick={start} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500">{T("开始", "Start")}</button>}
          {phase === "running" && <>
            <button onClick={() => setDistractions((x) => x + 1)} className="rounded-lg bg-rose-700/70 px-4 py-2 text-sm font-medium hover:bg-rose-600">{T("记一次分心", "Log distraction")}</button>
            <button onClick={stop} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600">{T("结束", "Stop")}</button>
          </>}
        </div>
        {phase === "review" && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3 text-sm"><label className="w-32 text-slate-400">{T("认知难度", "Difficulty")}</label><input type="range" min={0} max={100} value={Math.round(difficulty * 100)} onChange={(e) => setDifficulty(Number(e.target.value) / 100)} className="flex-1 accent-indigo-500" /><span className="w-10 text-right tabular-nums text-slate-300">{Math.round(difficulty * 100)}%</span></div>
            <div className="flex items-center gap-3 text-sm"><label className="w-32 text-slate-400">{T("产出质量", "Output quality")}</label><input type="range" min={0} max={100} value={Math.round(output * 100)} onChange={(e) => setOutput(Number(e.target.value) / 100)} className="flex-1 accent-indigo-500" /><span className="w-10 text-right tabular-nums text-slate-300">{Math.round(output * 100)}%</span></div>
            <div className="flex gap-2">
              <button onClick={commit} disabled={save.isPending} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50">{save.isPending ? T("保存中…", "Saving…") : T("保存会话", "Save session")}</button>
              <button onClick={reset} className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600">{T("丢弃", "Discard")}</button>
            </div>
          </div>
        )}
        {save.error && isUpgradeError(save.error) && <div className="mt-3"><UpgradeNotice feature={T("深度工作 · 深度版", "Deep Work · Flagship")} tier="Plus" /></div>}
      </Card>

      {review && (
        <div className="mt-4"><Card title={T("会话点评", "Session review")} accent="#34d399">
          <p className="text-sm text-slate-200">{review.focusVerdict}</p>
          <p className="mt-1 text-sm text-rose-300/90"><span className="text-slate-500">{T("主要分心", "Top distraction")}:</span> {review.topDistraction}</p>
          <p className="mt-1 text-sm text-emerald-300"><span className="text-slate-500">{T("下次调整", "Next time")}:</span> {review.oneAdjustment}</p>
        </Card></div>
      )}

      {d && (
        <div className="mt-4 space-y-4">
          <Card title={T("仪表盘", "Dashboard")}>
            <div className="flex flex-wrap items-end gap-6">
              <div><div className="text-xs text-slate-500">{T("深度工作分", "Deep Work score")}</div><div className="text-3xl font-bold tabular-nums">{Math.round(d.global)}</div></div>
              <div><div className="text-xs text-slate-500">{T("总时长", "Total minutes")}</div><div className="text-2xl font-bold tabular-nums text-slate-200">{d.totalMinutes}</div></div>
              <div><div className="text-xs text-slate-500">{T("会话数", "Sessions")}</div><div className="text-2xl font-bold tabular-nums text-slate-200">{d.totalSessions}</div></div>
            </div>
            <div className="mt-3 grid gap-1 sm:grid-cols-2">
              <ScoreBar label={T("一致性", "Consistency")} value={d.consistency} />
              <ScoreBar label={T("焦点深度", "Focus depth")} value={d.focusDepth} />
              <ScoreBar label={T("分心控制", "Distraction control")} value={d.distractionControl} />
              <ScoreBar label={T("产出价值", "Output value")} value={d.outputValue} />
            </div>
          </Card>
          <Card title={T("28 天热力图", "28-day heatmap")}>
            <div className="flex flex-wrap gap-1">
              {d.heatmap.map((h) => (
                <div key={h.date} title={`${h.date}: ${h.minutes}m · ${h.sessions} ${T("次", "sessions")}`} style={{ backgroundColor: heatColor(h.minutes) }} className="h-5 w-5 rounded-sm" />
              ))}
            </div>
            {(() => {
              const max = Math.max(1, ...d.heatmap.map((h) => h.minutes));
              const W = 320, Hh = 40, n = d.heatmap.length;
              const pts = d.heatmap.map((h, i) => `${((i / Math.max(1, n - 1)) * W).toFixed(1)},${(Hh - (h.minutes / max) * Hh).toFixed(1)}`).join(" ");
              return <svg viewBox={`0 0 ${W} ${Hh}`} className="mt-2 w-full" role="img" aria-label="Deep-work minutes trend"><polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" /></svg>;
            })()}
            <p className="mt-1 text-xs text-slate-500">{T("每格一天,越绿=深度工作越多;折线=每日分钟趋势。", "One cell per day; greener = more; the line is daily-minutes trend.")}</p>
          </Card>
          <Card title={T("每周汇总", "Weekly summary")}>
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-slate-500"><th className="text-left font-normal">{T("周起", "Week of")}</th><th className="text-right font-normal">{T("分钟", "Minutes")}</th><th className="text-right font-normal">{T("会话", "Sessions")}</th><th className="text-right font-normal">{T("均分", "Avg score")}</th></tr></thead>
              <tbody>
                {d.weekly.map((w) => (
                  <tr key={w.weekStart} className="border-t border-slate-800">
                    <td className="py-1 text-slate-300">{w.weekStart}</td>
                    <td className="py-1 text-right tabular-nums text-slate-200">{w.minutes}</td>
                    <td className="py-1 text-right tabular-nums text-slate-400">{w.sessions}</td>
                    <td className="py-1 text-right tabular-nums text-emerald-300">{w.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
