"use client";

import { Card } from "@/components/ui";
import { useT, useI18n } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import { distortionLabel } from "@/lib/domain/cognitive-distortions";
import type { CBTOutput } from "@/lib/domain/cbt";

type Result = CBTOutput & { recordId: string; mode: string };

export default function CBTClient() {
  const T = useT();
  const { locale } = useI18n();
  const en = locale === "en";
  return (
    <HealingSkillShell<Result>
      title={T("CBT 认知行为", "CBT Behavioral Change")}
      subtitle={T("把一个情境拆成想法→情绪→行为，识别认知扭曲，生成可验证的替代想法和一个小行动。", "Break a situation into thought → emotion → behavior, spot distortions, and get a testable alternative + one small action.")}
      endpoint="/api/cbt"
      placeholder={T("例如：老板没回我消息，我觉得他肯定对我不满意。", "e.g. My boss didn't reply — I'm sure he's unhappy with me.")}
      cta={{ zh: "分析", en: "Analyze" }}
      buildBody={(problem, sessionId) => ({ sessionId, situation: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("CBT 地图", "CBT map")}>
            {r.cbtMap.automaticThoughts.map((t, i) => (
              <p key={i} className="text-sm text-slate-200">💭 {t.thought} <span className="text-xs text-slate-500">→ {t.emotionTriggered.join(", ")}</span></p>
            ))}
            {r.cbtMap.outcomeLoop && <p className="mt-2 text-xs text-slate-400">{T("循环", "Loop")}: {r.cbtMap.outcomeLoop}</p>}
          </Card>

          {r.cognitiveDistortions.length > 0 && (
            <Card title={T("认知扭曲", "Cognitive distortions")} accent="#fbbf24">
              {r.cognitiveDistortions.map((d, i) => (
                <div key={i} className="mb-2">
                  <span className="rounded-full border border-amber-700/60 px-2 py-0.5 text-xs text-amber-300">{distortionLabel(d.distortion, en)}</span>
                  <p className="mt-1 text-xs text-slate-400">{d.evidence}</p>
                  <p className="text-xs text-indigo-300/80">? {d.reframeQuestion}</p>
                </div>
              ))}
            </Card>
          )}

          <Card title={T("证据检验", "Evidence check")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><div className="text-xs text-emerald-400/80">{T("支持", "For")}</div>{r.evidenceCheck.evidenceFor.map((e, i) => <p key={i} className="text-xs text-slate-300">· {e}</p>)}</div>
              <div><div className="text-xs text-rose-400/80">{T("反对", "Against")}</div>{r.evidenceCheck.evidenceAgainst.map((e, i) => <p key={i} className="text-xs text-slate-300">· {e}</p>)}</div>
            </div>
            {r.evidenceCheck.moreBalancedView && <p className="mt-2 text-sm text-emerald-200">⚖ {r.evidenceCheck.moreBalancedView}</p>}
          </Card>

          {r.alternativeThoughts.length > 0 && (
            <Card title={T("替代想法", "Alternative thoughts")} accent="#34d399">
              {r.alternativeThoughts.map((a, i) => (
                <div key={i} className="mb-2"><p className="text-xs text-slate-500 line-through">{a.oldThought}</p><p className="text-sm text-emerald-200">↳ {a.alternativeThought}</p></div>
              ))}
            </Card>
          )}

          <Card title={T("行动计划（已加入练习）", "Behavior plan (added to practice)")} accent="#818cf8">
            <div className="text-sm font-medium text-slate-100">{r.behaviorPlan.title} <span className="text-xs text-slate-500">· {r.behaviorPlan.difficulty}</span></div>
            <ol className="mt-1 list-decimal pl-5 text-sm text-slate-300">{r.behaviorPlan.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            {r.behaviorPlan.measurement && <p className="mt-1 text-xs text-slate-400">{T("如何衡量", "Measure")}: {r.behaviorPlan.measurement}</p>}
          </Card>
        </div>
      )}
    />
  );
}
