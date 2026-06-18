"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { EmotionRegulationOutput } from "@/lib/domain/emotion-regulation";

type Result = EmotionRegulationOutput & { recordId: string };

const AROUSAL_LABEL: Record<string, { zh: string; en: string }> = {
  hyperarousal: { zh: "高唤醒", en: "Hyperarousal" }, within_window: { zh: "承受窗口内", en: "Within window" },
  hypoarousal: { zh: "低唤醒", en: "Hypoarousal" }, mixed: { zh: "混合", en: "Mixed" }, unclear: { zh: "不明确", en: "Unclear" },
};

function PlanCol({ title, steps }: { title: string; steps: string[] }) {
  if (!steps?.length) return null;
  return (
    <div className="rounded-lg bg-slate-950/40 px-3 py-2">
      <div className="mb-1 text-xs font-semibold text-indigo-300">{title}</div>
      <ol className="list-decimal pl-4 text-xs text-slate-300">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export default function EmotionRegulationClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("情绪调节 · DBT/ACT", "Emotion Regulation · DBT/ACT")}
      subtitle={T("不是消灭情绪，而是稳定身体、理解功能、降低冲动、走向价值行动。", "Not erasing emotion — steadying the body, understanding its function, lowering the urge, moving toward a value.")}
      endpoint="/api/emotion-regulation"
      placeholder={T("例如：我现在很焦虑，心跳很快，脑子停不下来。", "e.g. I'm so anxious right now, heart pounding, mind racing.")}
      cta={{ zh: "现在帮我稳一下", en: "Help me steady now" }}
      buildBody={(problem, sessionId) => ({ sessionId, currentEmotionText: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("当前状态", "Current state")}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300">{(AROUSAL_LABEL[r.emotionalStateMap.arousalState] ?? { zh: r.emotionalStateMap.arousalState }).zh}</span>
              {r.emotionalStateMap.dominantEmotions.map((e, i) => <span key={i} className="text-sm text-slate-200">{e.name} <span className="text-xs text-slate-500">{e.intensity}/10</span></span>)}
            </div>
            {r.recommendedSkillSet.reason && <p className="mt-2 text-sm text-slate-300">{r.recommendedSkillSet.reason}</p>}
          </Card>

          <Card title={T("干预计划", "Intervention plan")} accent="#34d399">
            <div className="grid gap-2 sm:grid-cols-3">
              <PlanCol title={T("60 秒", "60 sec")} steps={r.interventionPlan.sixtySecondVersion} />
              <PlanCol title={T("5 分钟", "5 min")} steps={r.interventionPlan.fiveMinuteVersion} />
              <PlanCol title={T("20 分钟", "20 min")} steps={r.interventionPlan.twentyMinuteVersion} />
            </div>
          </Card>

          {r.dbtProcess && (
            <Card title={T("DBT", "DBT")} accent="#38bdf8">
              <p className="text-sm text-slate-200">✓ {r.dbtProcess.validationStatement}</p>
              <p className="mt-1 text-xs text-slate-400">{T("检查事实", "Check the facts")}: {r.dbtProcess.factCheckQuestion}</p>
              {r.dbtProcess.oppositeActionSuggestion && <p className="text-xs text-slate-400">{T("反向行动", "Opposite action")}: {r.dbtProcess.oppositeActionSuggestion}</p>}
            </Card>
          )}

          {r.actProcess && (
            <Card title={T("ACT", "ACT")} accent="#a78bfa">
              <p className="text-sm text-slate-200">🍃 {r.actProcess.defusionPhrase}</p>
              <p className="mt-1 text-xs text-slate-400">{T("价值", "Value")}: {r.actProcess.chosenValue}</p>
              <p className="text-xs text-emerald-300/80">{T("微行动", "Micro-action")}: {r.actProcess.committedMicroAction}</p>
            </Card>
          )}
        </div>
      )}
    />
  );
}
