"use client";

import { Card, PageHeader, StatGrid } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useT } from "@/lib/i18n/client";
import type { HealingTimelineOutput } from "@/lib/domain/timeline";

const DIR_LABEL: Record<string, { zh: string; en: string; color: string }> = {
  improving: { zh: "在好转", en: "Improving", color: "#34d399" },
  stable: { zh: "稳定", en: "Stable", color: "#38bdf8" },
  mixed: { zh: "有起伏", en: "Mixed", color: "#fbbf24" },
  declining: { zh: "需关注", en: "Needs attention", color: "#fb7185" },
  insufficient_data: { zh: "数据不足", en: "Insufficient data", color: "#94a3b8" },
};

export default function HealingTimelineClient() {
  const T = useT();
  const run = useApiMutation<Record<string, unknown>, { result: HealingTimelineOutput }>("/api/healing-timeline");
  const r = run.data?.result;
  const dir = r ? DIR_LABEL[r.timelineSummary.overallDirection] ?? DIR_LABEL.stable : null;

  return (
    <div className="space-y-5">
      <PageHeader title={T("疗愈时间线 · 进展", "Healing Journey · Progress")} subtitle={T("把所有会谈与练习汇总起来，看看自己是不是在前进。", "Aggregate every session and practice to see whether you're moving forward.")} />

      <button onClick={() => run.mutate({ reportMode: "weekly" })} disabled={run.isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
        {run.isPending ? T("汇总中…", "Aggregating…") : T("生成本周报告", "Generate weekly report")}
      </button>
      {run.error && <p className="mt-2 text-sm text-rose-400" role="alert">{run.error.message}</p>}

      {r && (
        <div className="space-y-4">
          <Card title={T("整体方向", "Overall direction")}>
            <div className="mb-3 text-2xl font-bold" style={{ color: dir?.color }}>{T(dir?.zh ?? "", dir?.en ?? "")}</div>
            <p className="text-sm leading-relaxed text-slate-200">{r.userFacingWeeklyReport}</p>
          </Card>

          <Card title={T("关键指标", "Key metrics")}>
            <StatGrid items={[
              { value: `${Math.round(r.progressMetrics.practiceCompletionRate * 100)}%`, label: T("练习完成率", "Practice done") },
              { value: r.progressMetrics.completedPracticeTasks, label: T("已完成练习", "Completed") },
              { value: r.progressMetrics.exposureCompletionCount, label: T("暴露尝试", "Exposures") },
              { value: r.progressMetrics.identityEvidenceCount, label: T("身份证据", "Identity evidence") },
              { value: r.progressMetrics.totalSessions, label: T("会谈数", "Sessions") },
            ]} />
          </Card>

          {r.patternChanges.length > 0 && (
            <Card title={T("模式变化", "Pattern changes")} accent="#34d399">
              {r.patternChanges.map((p, i) => (
                <div key={i} className="mb-2">
                  <div className="text-sm font-medium text-slate-100">{p.patternName}</div>
                  <p className="text-xs text-slate-500 line-through">{p.previousExpression}</p>
                  <p className="text-xs text-emerald-200">↳ {p.currentExpression}</p>
                </div>
              ))}
            </Card>
          )}

          {r.stuckPoints.length > 0 && (
            <Card title={T("卡点", "Stuck points")} accent="#fbbf24">
              {r.stuckPoints.map((s, i) => <p key={i} className="text-sm text-slate-300">· {s.stuckPoint} <span className="text-xs text-slate-500">→ {s.recommendedSkill}</span></p>)}
            </Card>
          )}

          {r.nextStepRecommendations.length > 0 && (
            <Card title={T("下一步", "Next steps")} accent="#818cf8">
              {r.nextStepRecommendations.sort((a, b) => a.priority - b.priority).map((n, i) => (
                <p key={i} className="text-sm text-slate-200">{n.priority}. {n.recommendation} <span className="text-xs text-slate-500">({n.relatedSkill})</span></p>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
