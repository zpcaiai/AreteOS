"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

interface Position { key: string; advisor: string; analysis: string; keyRisk: string; opportunity: string; recommendation: string; confidence: number }
interface Synthesis { summary: string; agreements: string[]; disagreements: string[]; keyRisks: string[]; recommendedDecision: string; confidence: number }
interface Memo { options: string[]; hiddenAssumptions: string[]; reversibility: string; recommendedNextStep: string; reviewInDays: number }
interface Metrics { agreement: number; confidencePolarization: number; meanConfidence: number }
interface Result { question: string; positions: Position[]; metrics: Metrics; synthesis: Synthesis; memo: Memo }

const pct = (x: number) => Math.round(x * 100);

export default function BoardroomPage() {
  const { locale } = useI18n();
  const T = useT();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const run = useApiMutation<{ question: string; options?: string[] }, { result: Result }>("/api/boardroom");
  const r = run.data?.result;

  function convene() {
    const opts = options.split(",").map((s) => s.trim()).filter(Boolean);
    run.mutate({ question, ...(opts.length ? { options: opts } : {}) });
  }

  return (
    <div>
      <PageHeader title={T("个人董事会", "Personal Boardroom")} subtitle={T("十位顾问从不同心智模型审视你的重大决策 —— 提升判断力,而非替你决定。", "Ten advisors weigh your decision from different mental models — to sharpen judgment, not replace it.")} />
      <Card title={T("提出一个重大决策", "Pose a high-stakes decision")}>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3}
          placeholder={T("例如:我该接受管理岗,还是继续做独立贡献者?", "e.g. Should I take the manager role or stay an IC?")}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200" />
        <input value={options} onChange={(e) => setOptions(e.target.value)} placeholder={T("可选:候选项,逗号分隔", "Optional: options, comma-separated")}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200" />
        <button onClick={convene} disabled={run.isPending || question.trim().length < 3}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50">
          {run.isPending ? T("董事会审议中…", "The board is deliberating…") : T("召集董事会", "Convene the board")}
        </button>
        {run.error && !isUpgradeError(run.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}
      </Card>

      {run.error && isUpgradeError(run.error) && <div className="mt-4"><UpgradeNotice feature={T("个人董事会", "Personal Boardroom")} /></div>}

      {r && (
        <div className="mt-4 space-y-4">
          <Card title={T("共识度量", "Consensus")}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><div className="text-2xl font-bold tabular-nums">{pct(r.metrics.agreement)}%</div><div className="text-xs text-slate-500">{T("一致度", "Agreement")}</div></div>
              <div><div className="text-2xl font-bold tabular-nums">{pct(r.metrics.confidencePolarization)}%</div><div className="text-xs text-slate-500">{T("信心极化", "Polarization")}</div></div>
              <div><div className="text-2xl font-bold tabular-nums">{pct(r.metrics.meanConfidence)}%</div><div className="text-xs text-slate-500">{T("平均信心", "Mean confidence")}</div></div>
            </div>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {r.positions.map((p) => (
              <Card key={p.key} title={p.advisor}>
                <p className="text-sm text-slate-200">{p.analysis}</p>
                <p className="mt-2 text-xs text-slate-300"><span className="text-slate-500">{T("建议", "Recommendation")}:</span> {p.recommendation}</p>
                <p className="mt-1 text-xs text-rose-300/80"><span className="text-slate-500">{T("风险", "Risk")}:</span> {p.keyRisk}</p>
                <p className="mt-1 text-xs text-emerald-300/80"><span className="text-slate-500">{T("机会", "Opportunity")}:</span> {p.opportunity}</p>
                <div className="mt-2"><ScoreBar label={T("信心", "Confidence")} value={p.confidence} /></div>
              </Card>
            ))}
          </div>
          <Card title={T("综合", "Synthesis")} accent="#34d399">
            <p className="text-sm text-slate-200">{r.synthesis.summary}</p>
            <p className="mt-2 text-sm text-emerald-300"><span className="text-slate-500">{T("推荐决策", "Recommended decision")}:</span> {r.synthesis.recommendedDecision}</p>
            {r.synthesis.disagreements.length > 0 && <div className="mt-2"><div className="text-xs text-slate-500">{T("分歧", "Disagreements")}</div><ul className="mt-1 space-y-1 text-xs text-amber-300/90">{r.synthesis.disagreements.map((a, i) => <li key={i}>· {a}</li>)}</ul></div>}
          </Card>
          <Card title={T("决策备忘", "Decision memo")} accent="#38bdf8">
            {r.memo.options.length > 0 && <div className="text-sm text-slate-300"><span className="text-slate-500">{T("选项", "Options")}:</span> {r.memo.options.join(" · ")}</div>}
            {r.memo.hiddenAssumptions.length > 0 && <div className="mt-1 text-sm text-slate-300"><span className="text-slate-500">{T("隐藏假设", "Hidden assumptions")}:</span> {r.memo.hiddenAssumptions.join("; ")}</div>}
            <p className="mt-1 text-sm text-slate-300"><span className="text-slate-500">{T("可逆性", "Reversibility")}:</span> {r.memo.reversibility}</p>
            <p className="mt-1 text-sm text-emerald-300"><span className="text-slate-500">{T("下一步", "Next step")}:</span> {r.memo.recommendedNextStep}</p>
            <p className="mt-1 text-xs text-slate-500">{T("复盘", "Review in")}: {r.memo.reviewInDays} {T("天", "days")}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
