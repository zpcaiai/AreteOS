"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { TraumaStabilizationOutput } from "@/lib/domain/trauma-stabilization";

type Result = TraumaStabilizationOutput & { recordId: string };

export default function StabilizationClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("创伤知情稳定化", "Trauma-Informed Stabilization")}
      subtitle={T("如果你被突然涌来的强烈感受淹没——闪回、惊恐、麻木——我们先回到当下。不需要讲发生了什么。", "If a wave of intense feeling — flashback, panic, numbness — is taking over, we return to the present first. You don't need to talk about what happened.")}
      endpoint="/api/trauma-stabilization"
      placeholder={T("例如：我突然感觉像又回到了那个时候，心跳很快，很害怕。", "e.g. I suddenly feel like I'm back then, heart racing, very scared.")}
      cta={{ zh: "帮我回到当下", en: "Help me return to the present" }}
      buildBody={(problem, sessionId) => ({ sessionId, currentExperience: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("先听你说", "First, this is true")} accent="#34d399">
            <p className="text-base leading-relaxed text-slate-100">{r.userFacingValidation}</p>
          </Card>

          <Card title={r.immediateProtocol.title || T("回到当下", "Return to the present")} accent="#38bdf8">
            <ol className="list-decimal space-y-1.5 pl-5 text-base text-slate-100">
              {r.immediateProtocol.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            {r.immediateProtocol.stopSignals.length > 0 && (
              <p className="mt-3 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-100/90">
                ⚠ {r.immediateProtocol.stopSignals.join(" ")}
              </p>
            )}
          </Card>

          {r.flashbackPlan && (
            <Card title={T("闪回应对", "Flashback")} accent="#a78bfa">
              <p className="text-sm text-slate-200">{r.flashbackPlan.recognitionStatement}</p>
              <p className="mt-1 text-sm text-emerald-200">{r.flashbackPlan.nowVsThenStatement}</p>
            </Card>
          )}

          {r.dissociationPlan && (
            <Card title={T("回到身体", "Reconnect to the body")} accent="#fbbf24">
              <ul className="text-sm text-slate-300">{r.dissociationPlan.activationSteps.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </Card>
          )}

          {r.supportPlan && (
            <Card title={T("联系支持", "Reach for support")} accent="#fb7185">
              <p className="text-sm text-slate-200">{r.supportPlan.recommendedSupportAction}</p>
              <p className="mt-1 rounded bg-slate-950/40 px-2 py-1 text-xs text-slate-300">“{r.supportPlan.messageTemplate}”</p>
              <p className="mt-1 text-xs text-slate-500">{r.supportPlan.professionalSupportNote}</p>
            </Card>
          )}

          <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
            {T("现在先稳定。更深入的创伤处理需要在受训专业人员的陪伴下进行——本工具不做创伤暴露或记忆处理。", "Stabilize first. Deeper trauma processing belongs with a trained professional — this tool does no exposure or memory work.")}
          </p>
        </div>
      )}
    />
  );
}
