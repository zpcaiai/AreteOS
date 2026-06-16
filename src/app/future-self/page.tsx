"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/dictionaries";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface MC { runs: number; horizonDays: number; baselineGrowth: number; expectedGrowth: number; p10: number; p50: number; p90: number; mean: number; threshold: number; probAboveThreshold: number }
interface Letter { letter: string; theDifference: string; biggestRisk: string; oneChange: string }
interface Result { horizonMonths: number; monteCarlo: MC; weakestLayer: string; letter: Letter | null }

const LEVERS: { key: string; labelKey: DictKey }[] = [
  { key: "habits", labelKey: "innov.lever.habits" },
  { key: "reflection", labelKey: "innov.lever.reflection" },
  { key: "decisions", labelKey: "innov.lever.decisions" },
  { key: "mentalModels", labelKey: "innov.lever.mentalModels" },
  { key: "firstPrinciples", labelKey: "innov.lever.firstPrinciples" },
];

const pct = (x: number) => Math.round(x * 100);

export default function FutureSelfPage() {
  const { t } = useI18n();
  const [policy, setPolicy] = useState<Record<string, number>>({});
  const [horizon, setHorizon] = useState(12);
  const [withLetter, setWithLetter] = useState(true);
  const run = useApiMutation<Record<string, unknown>, { futureSelf: Result }>("/api/future-self");
  const r = run.data?.futureSelf;

  return (
    <div>
      <PageHeader title={t("innov.future.title")} subtitle={t("innov.future.subtitle")} />
      <Card title={t("innov.future.policyCard")}>
        <div className="space-y-2.5">
          {LEVERS.map((l) => (
            <div key={l.key} className="flex items-center gap-3 text-sm">
              <label htmlFor={`fs-${l.key}`} className="w-40 shrink-0 text-slate-400">{t(l.labelKey)}</label>
              <input id={`fs-${l.key}`} type="range" min={0} max={100} value={Math.round((policy[l.key] ?? 0.5) * 100)}
                onChange={(e) => setPolicy((s) => ({ ...s, [l.key]: Number(e.target.value) / 100 }))} className="flex-1 accent-indigo-500" />
              <span className="w-10 text-right tabular-nums text-slate-300">{Math.round((policy[l.key] ?? 0.5) * 100)}%</span>
            </div>
          ))}
          <div className="flex items-center gap-3 text-sm">
            <label htmlFor="fs-horizon" className="w-40 shrink-0 text-slate-400">{t("innov.future.horizon")}</label>
            <input id="fs-horizon" type="range" min={3} max={60} step={3} value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} className="flex-1 accent-indigo-500" />
            <span className="w-10 text-right tabular-nums text-slate-300">{horizon}</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={withLetter} onChange={(e) => setWithLetter(e.target.checked)} className="accent-indigo-500" /> {t("innov.future.withLetter")}</label>
        </div>
        <button onClick={() => run.mutate({ horizonMonths: horizon, withLetter, policy })} disabled={run.isPending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? t("innov.future.projecting") : t("innov.future.project")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={t("innov.future.title")} /></div>}

      {r && (
        <div className="mt-4 space-y-4">
          <Card title={t("innov.future.dist").replace("{n}", String(r.horizonMonths))}>
            <div className="flex flex-wrap items-end gap-6">
              <div><div className="text-xs text-slate-500">{t("innov.future.today")}</div><div className="text-2xl font-bold tabular-nums">{pct(r.monteCarlo.baselineGrowth)}</div></div>
              <div className="pb-1 text-slate-500">→</div>
              <div><div className="text-xs text-slate-500">{t("innov.future.p10")}</div><div className="text-2xl font-bold tabular-nums text-rose-300">{pct(r.monteCarlo.p10)}</div></div>
              <div><div className="text-xs text-slate-500">{t("innov.future.p50")}</div><div className="text-2xl font-bold tabular-nums text-slate-100">{pct(r.monteCarlo.p50)}</div></div>
              <div><div className="text-xs text-slate-500">{t("innov.future.p90")}</div><div className="text-2xl font-bold tabular-nums text-emerald-300">{pct(r.monteCarlo.p90)}</div></div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{t("innov.future.beat")}:<span className="font-semibold text-emerald-300"> {pct(r.monteCarlo.probAboveThreshold)}%</span> ({t("innov.future.runsNote").replace("{n}", String(r.monteCarlo.runs))})</p>
            <p className="mt-1 text-xs text-slate-500">{t("innov.future.weakest")}:{r.weakestLayer}</p>
          </Card>
          {r.letter && (
            <Card title={t("innov.future.letterTitle")} accent="#a78bfa">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">{r.letter.letter}</p>
              <p className="mt-3 text-sm text-slate-300"><span className="text-slate-500">{t("innov.future.difference")}:</span> {r.letter.theDifference}</p>
              <p className="mt-1 text-sm text-amber-300/90"><span className="text-slate-500">{t("innov.future.bigRisk")}:</span> {r.letter.biggestRisk}</p>
              <p className="mt-1 text-sm text-emerald-300"><span className="text-slate-500">{t("innov.future.oneChange")}:</span> {r.letter.oneChange}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
