"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { SuggestionField } from "@/components/SuggestionField";

interface Position { key: string; persona: string; stance: string; reasoning: string; keyRisk: string; recommendation: string; confidence: number }
interface Metrics { members: number; meanConfidence: number; confidencePolarization: number; agreement: number; dominant: string }
interface Synthesis { agreements: string[]; tensions: string[]; synthesis: string; recommendedDecision: string; strongestDissent: string; confidence: number }
interface CouncilResult { question: string; positions: Position[]; metrics: Metrics; synthesis: Synthesis }

const pct = (x: number) => Math.round(x * 100);

export default function CouncilPage() {
  const { t } = useI18n();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const run = useApiMutation<{ question: string; options?: string[] }, { council: CouncilResult }>("/api/council");
  const c = run.data?.council;

  function convene() {
    const opts = options.split(",").map((s) => s.trim()).filter(Boolean);
    run.mutate({ question, ...(opts.length ? { options: opts } : {}) });
  }

  return (
    <div>
      <PageHeader title={t("innov.council.title")} subtitle={t("innov.council.subtitle")} />
      <Card title={t("innov.council.ask")}>
        <SuggestionField
          value={question}
          onChange={setQuestion}
          placeholder={t("innov.council.qPlaceholder")}
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200"
          chipLabel="问题备选"
          suggestions={[
            "我现在最应该聚焦哪一个成长协议？",
            "我应该继续打磨当前产品，还是先做用户验证？",
            "这个机会是否值得投入未来 30 天？",
          ]}
        />
        <div className="mt-2">
          <SuggestionField
            as="input"
            value={options}
            onChange={setOptions}
            placeholder={t("innov.council.optPlaceholder")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200"
            chipLabel="候选项备选"
            suggestions={[
              "继续推进, 暂缓观察, 放弃",
              "做用户访谈, 发布 MVP, 先收款验证",
              "聚焦产品, 聚焦销售, 聚焦交付",
            ]}
          />
        </div>
        <button onClick={convene} disabled={run.isPending || question.trim().length < 3}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? t("innov.council.convening") : t("innov.council.convene")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={t("innov.council.title")} /></div>}

      {c && (
        <div className="mt-4 space-y-4">
          <Card title={t("innov.council.metrics")}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><div className="text-2xl font-bold tabular-nums">{pct(c.metrics.agreement)}%</div><div className="text-xs text-slate-500">{t("innov.council.agreement")}</div></div>
              <div><div className="text-2xl font-bold tabular-nums">{pct(c.metrics.confidencePolarization)}%</div><div className="text-xs text-slate-500">{t("innov.council.polarization")}</div></div>
              <div><div className="text-2xl font-bold tabular-nums">{pct(c.metrics.meanConfidence)}%</div><div className="text-xs text-slate-500">{t("innov.council.meanConf")}</div></div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{t("innov.council.dominant")}:{c.metrics.dominant}</p>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            {c.positions.map((p) => (
              <Card key={p.key} title={p.persona}>
                <p className="text-sm font-medium text-slate-200">{p.stance}</p>
                <p className="mt-1 text-xs text-slate-400">{p.reasoning}</p>
                <p className="mt-2 text-xs text-slate-300"><span className="text-slate-500">{t("innov.council.recommend")}:</span> {p.recommendation}</p>
                <p className="mt-1 text-xs text-rose-300/80"><span className="text-slate-500">{t("innov.council.risk")}:</span> {p.keyRisk}</p>
                <div className="mt-2"><ScoreBar label={t("innov.council.confidence")} value={p.confidence} /></div>
              </Card>
            ))}
          </div>

          <Card title={t("innov.council.synthesis")} accent="#34d399">
            <p className="text-sm text-slate-200">{c.synthesis.synthesis}</p>
            <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{t("innov.council.decision")}:</span> {c.synthesis.recommendedDecision}</p>
            {c.synthesis.agreements.length > 0 && <div className="mt-3"><div className="text-xs text-slate-500">{t("innov.council.agreements")}</div><ul className="mt-1 space-y-1 text-xs text-slate-300">{c.synthesis.agreements.map((a, i) => <li key={i}>· {a}</li>)}</ul></div>}
            {c.synthesis.tensions.length > 0 && <div className="mt-3"><div className="text-xs text-slate-500">{t("innov.council.tensions")}</div><ul className="mt-1 space-y-1 text-xs text-amber-300/90">{c.synthesis.tensions.map((a, i) => <li key={i}>· {a}</li>)}</ul></div>}
            <p className="mt-3 text-xs text-slate-400"><span className="text-slate-500">{t("innov.council.dissent")}:</span> {c.synthesis.strongestDissent}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
