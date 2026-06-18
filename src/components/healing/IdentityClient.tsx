"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { IdentityReconstructionOutput } from "@/lib/domain/identity-rebuild";

type Result = IdentityReconstructionOutput & { recordId: string; mode: string };

export default function IdentityClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("身份重建 · 使命恢复", "Identity Reconstruction")}
      subtitle={T("从'我不再是谁'走向'我正在成为谁'——用每天的小证据，而不是空洞的口号。", "From who you're no longer to who you're becoming — built on daily evidence, not slogans.")}
      endpoint="/api/identity-reconstruction"
      placeholder={T("例如：我总觉得自己是失败者，做什么都不够好。", "e.g. I always feel like a failure, never good enough at anything.")}
      cta={{ zh: "重建身份", en: "Rebuild identity" }}
      buildBody={(problem, sessionId) => ({ sessionId, currentIdentityPain: problem })}
      renderResult={(r) => (
        <div className="space-y-4">
          {r.identityMap.transitionIdentities.length > 0 && (
            <Card title={T("从旧身份到新身份", "Old → transition → new")} accent="#f472b6">
              {r.identityMap.transitionIdentities.map((t, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs text-slate-500 line-through">{t.oldNarrative}</p>
                  <p className="text-sm text-amber-200">↳ {t.transitionIdentity}</p>
                  <p className="text-xs text-slate-400">{t.whyThisIsBelievable}</p>
                </div>
              ))}
              {r.identityMap.newIdentitySeeds.map((s, i) => (
                <p key={i} className="mt-1 text-sm text-emerald-200">🌱 {s.identitySeed}</p>
              ))}
            </Card>
          )}

          <Card title={T("7 天身份证据计划（已加入练习）", "7-day evidence plan (added to practice)")} accent="#34d399">
            <p className="mb-2 text-sm text-slate-200">“{r.dailyEvidencePlan.identityStatement}”</p>
            <div className="space-y-1">
              {r.dailyEvidencePlan.sevenDayEvidenceActions.map((d) => (
                <div key={d.day} className="flex gap-3 text-sm">
                  <span className="w-12 shrink-0 text-xs text-slate-500">Day {d.day}</span>
                  <span className="text-slate-300">{d.action}</span>
                </div>
              ))}
            </div>
            {r.dailyEvidencePlan.fallbackAction && <p className="mt-2 text-xs text-slate-500">{T("低能量时", "Low-energy day")}: {r.dailyEvidencePlan.fallbackAction}</p>}
          </Card>

          {r.missionRecovery.valuesToRecover.length > 0 && (
            <Card title={T("使命恢复方向", "Mission recovery")} accent="#a78bfa">
              <p className="text-sm text-slate-300">{T("想恢复的价值", "Values to recover")}: {r.missionRecovery.valuesToRecover.join("、")}</p>
              {r.missionRecovery.workOrCreationDirection && <p className="text-xs text-slate-400">{r.missionRecovery.workOrCreationDirection}</p>}
            </Card>
          )}

          <Card title={T("整合", "Integration")}>
            <p className="text-sm leading-relaxed text-slate-200">{r.integrationSummary}</p>
          </Card>
          {r.cautions.length > 0 && <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">{r.cautions.join(" ")}</p>}
        </div>
      )}
    />
  );
}
