"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface TurningPoint { at: number; delta: number; direction: "up" | "down" }
interface Trajectory { points: number; change: number; momentum: string }
interface Activity { total: number; topEngine: string }
interface Transition { fromStage: string; toStage: string; at: number }
interface Signals { trajectory: Trajectory; turningPoints: TurningPoint[]; activity: Activity; transitions: Transition[] }
interface Narr { title: string; chapters: { heading: string; body: string }[]; throughline: string; nextChapter: string }
interface Result { periodDays: number; signals: Signals; narrative: Narr | null }

const fmt = (at: number) => new Date(at).toISOString().slice(0, 10);

export default function NarrativePage() {
  const { t } = useI18n();
  const [days, setDays] = useState(90);
  const run = useApiMutation<{ periodDays: number; withProse: boolean }, { narrative: Result }>("/api/narrative");
  const r = run.data?.narrative;

  return (
    <div>
      <PageHeader title={t("innov.narrative.title")} subtitle={t("innov.narrative.subtitle")} />
      <Card title={t("innov.narrative.genCard")}>
        <div className="flex items-center gap-3 text-sm">
          <label htmlFor="nar-days" className="w-32 shrink-0 text-slate-400">{t("innov.narrative.days")}</label>
          <input id="nar-days" type="range" min={14} max={365} step={7} value={days} onChange={(e) => setDays(Number(e.target.value))} className="flex-1 accent-indigo-500" />
          <span className="w-12 text-right tabular-nums text-slate-300">{days}</span>
        </div>
        <button onClick={() => run.mutate({ periodDays: days, withProse: true })} disabled={run.isPending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? t("innov.narrative.generating") : t("innov.narrative.generate")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={t("innov.narrative.title")} tier="Plus" /></div>}

      {r && (
        <div className="mt-4 space-y-4">
          <Card title={t("innov.narrative.signals")}>
            <p className="text-sm text-slate-300">{t("innov.narrative.momentum")}:<span className="font-medium text-slate-100"> {r.signals.trajectory.momentum}</span> · {t("innov.narrative.netChange")} {r.signals.trajectory.change >= 0 ? "+" : ""}{Math.round(r.signals.trajectory.change * 100)} {t("innov.narrative.points")} · {t("innov.narrative.topEngine")} {r.signals.activity.topEngine || "—"}</p>
            {r.signals.turningPoints.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-slate-400">
                {r.signals.turningPoints.map((tp, i) => <li key={i}>· {fmt(tp.at)} {tp.direction === "up" ? "↑" : "↓"} {tp.delta >= 0 ? "+" : ""}{Math.round(tp.delta * 100)} {t("innov.narrative.points")}</li>)}
              </ul>
            )}
            {r.signals.transitions.length > 0 && <p className="mt-2 text-xs text-slate-400">{t("innov.narrative.transitions")}:{r.signals.transitions.map((tr) => `${tr.fromStage}→${tr.toStage}`).join(", ")}</p>}
          </Card>
          {r.narrative && (
            <Card title={r.narrative.title} accent="#38bdf8">
              <div className="space-y-3">
                {r.narrative.chapters.map((ch, i) => (
                  <div key={i} className="border-t border-slate-800 pt-2 first:border-t-0 first:pt-0">
                    <div className="text-sm font-semibold text-slate-100">{ch.heading}</div>
                    <p className="text-sm text-slate-300">{ch.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-sky-300"><span className="text-slate-500">{t("innov.narrative.throughline")}:</span> {r.narrative.throughline}</p>
              <p className="mt-1 text-sm text-slate-400"><span className="text-slate-500">{t("innov.narrative.nextChapter")}:</span> {r.narrative.nextChapter}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
