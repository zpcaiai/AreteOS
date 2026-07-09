"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/dictionaries";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { SuggestionField, SuggestionChips } from "@/components/SuggestionField";

interface Summary { id: string; hypothesis: string; metric: string; unit: string; baselineN: number; interventionN: number }
interface Readout { nBaseline: number; nIntervention: number; meanBaseline: number; meanIntervention: number; meanDiff: number; cohensD: number; pApprox: number; direction: string; verdict: string }
interface ReadoutResult { spec: { id: string; hypothesis: string; metric: string; unit: string }; readout: Readout }

const LIST = "/api/experiments";
const VERDICT: Record<string, { key: DictKey; color: string }> = {
  "strong": { key: "innov.exp.v.strong", color: "text-emerald-400" },
  "promising": { key: "innov.exp.v.promising", color: "text-sky-400" },
  "inconclusive": { key: "innov.exp.v.inconclusive", color: "text-amber-400" },
  "no-effect": { key: "innov.exp.v.noeffect", color: "text-slate-400" },
  "insufficient-data": { key: "innov.exp.v.insufficient", color: "text-slate-500" },
};

export default function ExperimentsPage() {
  const { t } = useI18n();
  const list = useApi<{ experiments: Summary[] }>(LIST);
  const [selected, setSelected] = useState<string | null>(null);
  const readoutUrl = selected ? `/api/experiments/${selected}` : null;
  const readout = useApi<{ experiment: ReadoutResult }>(readoutUrl);

  const [hypothesis, setHypothesis] = useState("");
  const [metric, setMetric] = useState("");
  const create = useApiMutation<{ hypothesis: string; metric: string }, { id: string }>(LIST, { invalidate: [LIST] });

  const [phase, setPhase] = useState<"baseline" | "intervention">("baseline");
  const [value, setValue] = useState("");
  const observe = useApiMutation<{ phase: string; value: number }>(`/api/experiments/${selected ?? "none"}/observe`, { invalidate: [LIST, readoutUrl ?? LIST] });

  const r = readout.data?.experiment.readout;
  const v = r ? VERDICT[r.verdict] : null;

  return (
    <div>
      <PageHeader title={t("innov.exp.title")} subtitle={t("innov.exp.subtitle")} />

      <Card title={t("innov.exp.newCard")}>
        <SuggestionField
          as="input"
          value={hypothesis}
          onChange={setHypothesis}
          placeholder={t("innov.exp.hypPlaceholder")}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
          chipLabel="假设备选"
          suggestions={[
            "如果把首页 CTA 改成“今天行动”，首日完成率会提升。",
            "如果模板预填更具体，用户创建第一个工作区的时间会下降。",
            "如果先要求一次客户验证，用户更愿意为项目工作台付费。",
          ]}
        />
        <div className="mt-2">
          <SuggestionField
            as="input"
            value={metric}
            onChange={setMetric}
            placeholder={t("innov.exp.metricPlaceholder")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
            chipLabel="指标备选"
            suggestions={["首次工作区创建率", "5 分钟行动完成率", "用户访谈预约数", "付费转化意向数"]}
          />
        </div>
        <button onClick={() => create.mutate({ hypothesis, metric })} disabled={create.isPending || hypothesis.length < 3 || metric.length < 1}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">{create.isPending ? t("innov.exp.creating") : t("innov.exp.create")}</button>
        {create.error && !isUpgradeError(create.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{create.error.message}</p>}
        {create.error && isUpgradeError(create.error) && <div className="mt-3"><UpgradeNotice feature={t("innov.exp.title")} tier="Plus" /></div>}
      </Card>

      <div className="mt-4">
        <Card title={t("innov.exp.mine")}>
          {list.data?.experiments.length ? (
            <ul className="space-y-2">
              {list.data.experiments.map((x) => (
                <li key={x.id}>
                  <button onClick={() => setSelected(x.id)} className={`w-full rounded-lg border p-2 text-left text-sm ${selected === x.id ? "border-indigo-500 bg-indigo-950/30" : "border-slate-800 hover:border-slate-700"}`}>
                    <div className="font-medium text-slate-200">{x.hypothesis}</div>
                    <div className="text-xs text-slate-500">{x.metric} · {t("innov.exp.baseline")} {x.baselineN} / {t("innov.exp.intervention")} {x.interventionN}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">{t("innov.exp.none")}</p>}
        </Card>
      </div>

      {selected && (
        <div className="mt-4 space-y-4">
          <Card title={t("innov.exp.recordCard")}>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <select value={phase} onChange={(e) => setPhase(e.target.value as "baseline" | "intervention")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
                <option value="baseline">{t("innov.exp.baseline")}</option>
                <option value="intervention">{t("innov.exp.intervention")}</option>
              </select>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={t("innov.exp.value")} className="w-28 rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
              <button onClick={() => { if (value !== "") observe.mutate({ phase, value: Number(value) }); }} disabled={observe.isPending || value === ""}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{t("innov.exp.record")}</button>
            </div>
            <SuggestionChips suggestions={["1", "3", "5", "10"]} value={value} onChange={setValue} label="数值备选" />
            {observe.error && isUpgradeError(observe.error) && <div className="mt-3"><UpgradeNotice feature={t("innov.exp.title")} tier="Plus" /></div>}
          </Card>
          {r && v && (
            <Card title={t("innov.exp.readout")}>
              <div className={`text-2xl font-bold ${v.color}`}>{t(v.key)}</div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-slate-300 md:grid-cols-4">
                <div><div className="text-xs text-slate-500">{t("innov.exp.baseMean")}</div><div className="tabular-nums">{r.meanBaseline.toFixed(2)}</div></div>
                <div><div className="text-xs text-slate-500">{t("innov.exp.intMean")}</div><div className="tabular-nums">{r.meanIntervention.toFixed(2)}</div></div>
                <div><div className="text-xs text-slate-500">{t("innov.exp.diff")}</div><div className="tabular-nums">{r.meanDiff >= 0 ? "+" : ""}{r.meanDiff.toFixed(2)}</div></div>
                <div><div className="text-xs text-slate-500">{t("innov.exp.effect")}</div><div className="tabular-nums">{Number.isFinite(r.cohensD) ? r.cohensD.toFixed(2) : "∞"}</div></div>
              </div>
              <p className="mt-2 text-xs text-slate-500">{t("innov.exp.direction")}:{r.direction} · p ≈ {r.pApprox.toFixed(3)} · n = {r.nBaseline}/{r.nIntervention}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
