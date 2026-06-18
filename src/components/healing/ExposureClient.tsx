"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { ExposureOutput } from "@/lib/domain/exposure";

type Result = ExposureOutput & { planId: string };

export default function ExposureClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("回避与暴露训练", "Avoidance & Exposure")}
      subtitle={T("识别回避循环，设计一个温和的、分级的行为实验阶梯。成功 = 接近并记录，不是完全不焦虑。", "Map the avoidance loop and build a gentle, graded ladder. Success = approaching and recording, not zero anxiety.")}
      endpoint="/api/exposure"
      placeholder={T("例如：我开会不敢说话，怕别人觉得我很蠢。", "e.g. I avoid speaking in meetings, afraid people will think I'm stupid.")}
      cta={{ zh: "设计暴露阶梯", en: "Build an exposure ladder" }}
      buildBody={(problem, sessionId) => ({ sessionId, avoidanceProblem: problem })}
      renderResult={(r) =>
        r.blocked ? (
          <Card title={T("这一项我们先不做", "Let's not do this one here")} accent="#fb7185">
            <p className="text-sm leading-relaxed text-rose-100/90">{r.cautions.join(" ")}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card title={T("回避循环", "Avoidance loop")} accent="#fbbf24">
              <p className="text-sm text-slate-200">{r.avoidanceLoop.trigger} → 😟 {r.avoidanceLoop.fearPrediction} → {r.avoidanceLoop.avoidanceBehavior}</p>
              <p className="mt-1 text-xs text-slate-400"><span className="text-emerald-400/80">{T("短期", "Short-term")}:</span> {r.avoidanceLoop.shortTermRelief} · <span className="text-rose-400/80">{T("长期", "Long-term")}:</span> {r.avoidanceLoop.longTermCost}</p>
            </Card>

            <Card title={T("暴露阶梯", "Exposure ladder")} accent="#34d399">
              <div className="space-y-1.5">
                {r.hierarchy.map((h) => (
                  <div key={h.level} className="flex items-center gap-3 rounded-lg bg-slate-950/40 px-3 py-1.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold tabular-nums text-white">{h.level}</span>
                    <div className="flex-1">
                      <div className="text-sm text-slate-100">{h.action}</div>
                      <div className="text-xs text-slate-500">{h.difficulty} · {T("预测焦虑", "predicted")} {h.predictedDistress}/10 · {h.successCriteria}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={T("本周实验（已加入练习）", "This week's experiment (added to practice)")} accent="#818cf8">
              <div className="text-sm font-medium text-slate-100">{r.selectedExperiment.title}</div>
              <p className="text-xs text-slate-400">{T("验证", "Test")}: {r.selectedExperiment.newLearningTarget}</p>
              <ol className="mt-1 list-decimal pl-5 text-sm text-slate-300">{r.selectedExperiment.actionSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              {r.selectedExperiment.stopRules.length > 0 && <p className="mt-1 text-xs text-rose-300/80">⏸ {r.selectedExperiment.stopRules.join("；")}</p>}
            </Card>

            <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">{r.cautions.join(" ")}</p>
          </div>
        )
      }
    />
  );
}
