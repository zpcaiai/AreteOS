"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { BOTTLENECKS, type Bi } from "@/lib/bottleneck-rules";
import { SuggestionField } from "@/components/SuggestionField";

interface Rx { title: string; whyItMatters: string; sevenDay: string[]; thirtyDay: string[]; metrics: string[]; firstAction: string }
interface Result { bottleneck: string; prescription: Rx }

export default function PrescriptionsPage() {
  const { locale } = useI18n();
  const L = (b: Bi) => (locale === "en" ? b.en : b.zh);
  const T = useT();
  const latest = useApi<{ latest: { primary?: string } | null }>("/api/bottlenecks");
  const [bottleneck, setBottleneck] = useState("");
  const [context, setContext] = useState("");
  const run = useApiMutation<{ bottleneck: string; context: string }, { result: Result }>("/api/prescriptions");
  const chosen = bottleneck || latest.data?.latest?.primary || BOTTLENECKS[0].key;
  const rx = run.data?.result.prescription;

  return (
    <div>
      <PageHeader title={T("成长处方", "Growth Prescription")} subtitle={T("把诊断变成精准、限时、可衡量的干预。", "Turn a diagnosis into a precise, time-bounded intervention.")} />
      <Card title={T("生成处方", "Generate a prescription")}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="text-slate-400">{T("瓶颈", "Bottleneck")}</label>
          <select value={chosen} onChange={(e) => setBottleneck(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
            {BOTTLENECKS.map((b) => <option key={b.key} value={b.key}>{L(b.name)}</option>)}
          </select>
          {latest.data?.latest?.primary && <span className="text-xs text-slate-500">{T("已根据最近诊断预填", "prefilled from your latest diagnosis")}</span>}
        </div>
        <div className="mt-2">
          <SuggestionField
            value={context}
            onChange={setContext}
            rows={2}
            placeholder={T("情境(可选)…", "Context (optional)…")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
            chipLabel={T("情境备选", "Context options")}
            suggestions={[
              T("本周只能投入 3 个 25 分钟时间块，需要最小有效行动。", "This week I only have three 25-minute blocks and need the smallest effective action."),
              T("已经有初版产品，但缺少真实用户反馈。", "I have a first version but lack real user feedback."),
              T("团队目标不清，大家都在做局部优化。", "Team goals are unclear and everyone is locally optimizing."),
            ]}
          />
        </div>
        <button onClick={() => run.mutate({ bottleneck: chosen, context })} disabled={run.isPending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? T("生成中…", "Generating…") : T("生成处方", "Generate prescription")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={T("成长处方", "Growth Prescription")} tier="Plus" /></div>}

      {rx && (
        <div className="mt-4 space-y-4">
          <Card title={rx.title} accent="#34d399">
            <p className="text-sm text-slate-300">{rx.whyItMatters}</p>
            <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{T("今天就做", "First action")}:</span> {rx.firstAction}</p>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            <Card title={T("7 天计划", "7-day plan")}>
              <ul className="space-y-1 text-sm text-slate-300">{rx.sevenDay.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </Card>
            <Card title={T("30 天计划", "30-day plan")}>
              <ul className="space-y-1 text-sm text-slate-300">{rx.thirtyDay.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </Card>
          </div>
          {rx.metrics.length > 0 && (
            <Card title={T("指标", "Metrics")}>
              <ul className="space-y-1 text-sm text-slate-300">{rx.metrics.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
