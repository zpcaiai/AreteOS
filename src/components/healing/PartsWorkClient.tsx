"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { PartsWorkOutput } from "@/lib/domain/parts-work";

type Result = PartsWorkOutput & { recordId: string; mode: string };

export default function PartsWorkClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("内在部分工作", "Parts Work")}
      subtitle={T("你内在常常有不同的声音在拉扯。我们认识每个部分在保护什么，让健康成人来带领。", "Different inner voices pull in different directions. We meet what each part protects, and let the Healthy Adult lead.")}
      endpoint="/api/parts-work"
      placeholder={T("例如：一部分我想努力完成项目，另一部分就是想逃避、刷手机。", "e.g. Part of me wants to push through the project; another just wants to avoid and scroll.")}
      cta={{ zh: "认识我的内在部分", en: "Meet my inner parts" }}
      buildBody={(problem, sessionId) => ({ sessionId, currentConflict: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("内在部分", "Inner parts")} accent="#f472b6">
            <div className="space-y-2">
              {r.partsMap.map((p, i) => (
                <div key={i} className="rounded-lg bg-slate-950/40 px-3 py-2">
                  <div className="text-sm font-medium text-slate-100">{p.partName} <span className="text-xs text-slate-500">· {p.partType}</span></div>
                  <p className="text-xs text-slate-400">“{p.voice}”</p>
                  <p className="mt-1 text-xs text-emerald-400/80">{T("它在保护", "Protects")}: {p.protectionGoal}</p>
                  <p className="text-xs text-slate-400">{T("它需要", "It needs")}: {p.whatItNeeds}</p>
                </div>
              ))}
            </div>
          </Card>

          {r.internalConflictSummary.sharedPositiveIntention && (
            <Card title={T("它们的共同善意", "Their shared good intention")} accent="#34d399">
              <p className="text-sm text-slate-200">{r.internalConflictSummary.sharedPositiveIntention}</p>
            </Card>
          )}

          <Card title={T("健康成人的回应", "Healthy Adult response")} accent="#38bdf8">
            <p className="text-sm text-slate-200">{r.healthyAdultResponse.stance}</p>
            {r.healthyAdultResponse.validationForEachPart.map((v, i) => (
              <p key={i} className="mt-1 text-xs text-slate-300">· {v.partName}: {v.validation} <span className="text-slate-500">{v.newRoleInvitation}</span></p>
            ))}
            {r.healthyAdultResponse.integrativeStatement && <p className="mt-2 text-sm text-emerald-200">{r.healthyAdultResponse.integrativeStatement}</p>}
          </Card>

          {r.innerDialogueScript.length > 0 && (
            <Card title={T("内在对话", "Inner dialogue")}>
              {r.innerDialogueScript.map((l, i) => <p key={i} className="text-sm text-slate-300"><span className="text-slate-500">{l.speaker}:</span> {l.line}</p>)}
            </Card>
          )}

          {r.cautions.length > 0 && <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">{r.cautions.join(" ")}</p>}
        </div>
      )}
    />
  );
}
