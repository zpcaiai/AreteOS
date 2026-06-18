"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { CoreBeliefOutput } from "@/lib/domain/belief";

type Result = CoreBeliefOutput & { recordId: string };

const TYPE_LABEL: Record<string, string> = {
  core_belief: "核心信念", conditional_belief: "条件信念", rule_belief: "规则", identity_belief: "身份信念",
  world_belief: "世界信念", relationship_belief: "关系信念", value_conflict: "价值冲突", protective_assumption: "保护性假设",
};

export default function CoreBeliefClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("核心信念重构", "Core Belief Reconstruction")}
      subtitle={T("找到底层信念，把它重构成更真实、可验证的新信念。", "Find the underlying belief and reshape it into a truer, testable one.")}
      endpoint="/api/core-belief"
      placeholder={T("例如：我开会不敢说话，怕说错被别人看不起。", "e.g. I freeze in meetings, afraid I'll be judged for saying something wrong.")}
      cta={{ zh: "分析信念", en: "Analyze beliefs" }}
      buildBody={(problem, sessionId) => ({ sessionId, problemStatement: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("识别出的信念", "Beliefs identified")} accent="#fb7185">
            <div className="space-y-2">
              {r.extractedBeliefs.map((b, i) => (
                <div key={i} className="rounded-lg bg-slate-950/40 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-100">{b.belief}</p>
                    <span className="shrink-0 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">{TYPE_LABEL[b.type] ?? b.type}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400"><span className="text-emerald-400/80">{T("它在保护", "Protects")}:</span> {b.protectionFunction}</p>
                  <p className="text-xs text-slate-400"><span className="text-rose-400/80">{T("长期代价", "Long-term cost")}:</span> {b.longTermCost}</p>
                </div>
              ))}
            </div>
          </Card>

          {r.reconstructedBeliefs.length > 0 && (
            <Card title={T("重构后的新信念", "Reconstructed beliefs")} accent="#34d399">
              <div className="space-y-3">
                {r.reconstructedBeliefs.map((b, i) => (
                  <div key={i}>
                    <p className="text-xs text-slate-500 line-through">{b.oldBelief}</p>
                    <p className="text-sm text-emerald-200">↳ {b.newBelief}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{b.whyMoreBalanced}</p>
                    <p className="mt-0.5 text-xs text-indigo-300/80">{T("小练习", "Small practice")}: {b.smallPractice}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {r.behavioralExperiments.length > 0 && (
            <Card title={T("行为实验（已加入练习）", "Behavioral experiments (added to practice)")} accent="#818cf8">
              <div className="space-y-3">
                {r.behavioralExperiments.map((e, i) => (
                  <div key={i} className="rounded-lg bg-slate-950/40 px-3 py-2">
                    <div className="text-sm font-medium text-slate-100">{e.experimentName} <span className="text-xs text-slate-500">· {e.difficulty}</span></div>
                    <p className="text-xs text-slate-300">{e.actionStep}</p>
                    <p className="mt-1 text-xs text-slate-400"><span className="text-slate-500">{T("预测的恐惧", "Predicted fear")}:</span> {e.predictedFear}</p>
                    <p className="text-xs text-slate-400"><span className="text-slate-500">{T("如何衡量", "Measure")}:</span> {e.measurableOutcome}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {r.identitySeeds.length > 0 && (
            <Card title={T("新身份种子", "New identity seeds")} accent="#f472b6">
              {r.identitySeeds.map((s, i) => (
                <p key={i} className="text-sm text-slate-200">{s.newIdentitySeed} <span className="text-xs text-slate-500">— {s.dailyEvidenceAction}</span></p>
              ))}
            </Card>
          )}

          {r.cautions.length > 0 && <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">{r.cautions.join(" ")}</p>}
        </div>
      )}
    />
  );
}
