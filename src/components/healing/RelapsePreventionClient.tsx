"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";
import HealingSkillShell from "./HealingSkillShell";
import type { RelapsePreventionOutput } from "@/lib/domain/relapse-prevention";

type Result = RelapsePreventionOutput & { planId: string };

const RISK_LABEL: Record<string, { zh: string; color: string }> = {
  low: { zh: "低", color: "#34d399" }, moderate: { zh: "中", color: "#fbbf24" }, high: { zh: "高", color: "#fb923c" }, urgent: { zh: "紧急", color: "#fb7185" },
};

export default function RelapsePreventionClient() {
  const T = useT();
  return (
    <HealingSkillShell<Result>
      title={T("复发预防 · 长期维护", "Relapse Prevention & Maintenance")}
      subtitle={T("旧模式不是失败，是信号。我们提前准备好预警信号和 if-then 应对计划。", "An old pattern isn't failure — it's a signal. We prepare early-warning signals and if-then plans in advance.")}
      endpoint="/api/relapse-prevention"
      placeholder={T("例如：我最近又开始拖延，连续几天没做练习。", "e.g. I've started procrastinating again — haven't practiced for days.")}
      cta={{ zh: "制定维护计划", en: "Build a maintenance plan" }}
      buildBody={(problem, sessionId) => ({ sessionId, currentConcern: problem, mode: "early_warning_check" })}
      renderResult={(r) => (
        <div className="space-y-4">
          <Card title={T("复发风险", "Relapse risk")}>
            <span className="text-lg font-bold" style={{ color: RISK_LABEL[r.relapseRiskMap.riskLevel]?.color }}>{RISK_LABEL[r.relapseRiskMap.riskLevel]?.zh ?? r.relapseRiskMap.riskLevel}</span>
            <p className="mt-2 text-sm text-slate-300">{r.identityMaintenance.repairStatement}</p>
          </Card>

          {r.relapseRiskMap.earlyWarningSignals.length > 0 && (
            <Card title={T("早期预警信号", "Early warning signals")} accent="#fbbf24">
              {r.relapseRiskMap.earlyWarningSignals.map((s, i) => (
                <div key={i} className="mb-2"><p className="text-sm text-slate-100">⚑ {s.signal}</p><p className="text-xs text-slate-400">{s.meaning} → {s.recommendedResponse}</p></div>
              ))}
            </Card>
          )}

          {r.ifThenPlans.length > 0 && (
            <Card title={T("If-Then 应对计划", "If-Then plans")} accent="#818cf8">
              {r.ifThenPlans.map((p, i) => (
                <p key={i} className="mb-1 text-sm text-slate-200"><span className="text-amber-300">{T("如果", "If")}</span> {p.ifSignal} → <span className="text-emerald-300">{T("就", "then")}</span> {p.thenAction} <span className="text-xs text-slate-500">({p.relatedSkill})</span></p>
              ))}
            </Card>
          )}

          <Card title={T("恢复计划", "Recovery protocol")} accent="#38bdf8">
            <div className="text-xs font-semibold text-slate-400">{T("24 小时", "24 hours")}</div>
            <ol className="mb-2 list-decimal pl-5 text-sm text-slate-300">{r.recoveryProtocol.twentyFourHourPlan.map((s, i) => <li key={i}>{s}</li>)}</ol>
            {r.recoveryProtocol.sevenDayPlan.length > 0 && <><div className="text-xs font-semibold text-slate-400">{T("7 天", "7 days")}</div><ul className="text-sm text-slate-300">{r.recoveryProtocol.sevenDayPlan.map((s, i) => <li key={i}>· {s}</li>)}</ul></>}
          </Card>

          <Card title={T("身份维护（已加入练习）", "Identity maintenance (added to practice)")} accent="#f472b6">
            <p className="text-sm text-slate-200">{r.identityMaintenance.newIdentityReminder}</p>
            <p className="text-xs text-slate-400">{T("最小证据行动", "Minimum evidence action")}: {r.identityMaintenance.minimumEvidenceAction}</p>
          </Card>
          {r.cautions.length > 0 && <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">{r.cautions.join(" ")}</p>}
        </div>
      )}
    />
  );
}
