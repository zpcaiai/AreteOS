// ───────────── Healing OS · Relapse-prevention pure logic (deterministic) ─────────────
import type { RelapseSignals, RelapsePreventionCore, RelapseNextSkill } from "../domain/relapse-prevention";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

export type RelapseRisk = "low" | "moderate" | "high" | "urgent";

/** Count active warning signals + map to a relapse risk band (safety-aware). */
export function detectRelapseSignals(signals: RelapseSignals | undefined, safetyRisk: RiskLevel): { activeSignals: string[]; relapseRisk: RelapseRisk } {
  const active = Object.entries(signals ?? {}).filter(([, v]) => v === true).map(([k]) => k);
  let relapseRisk: RelapseRisk;
  // Safety always dominates.
  if (safetyRisk === "red") relapseRisk = "urgent";
  else if (safetyRisk === "orange" || signals?.riskLevelIncreased) relapseRisk = "high";
  else if (active.length >= 3) relapseRisk = "high";
  else if (active.length >= 1) relapseRisk = "moderate";
  else relapseRisk = "low";
  return { activeSignals: active, relapseRisk };
}

export function recommendRelapseNextSkills(relapseRisk: RelapseRisk): RelapseNextSkill[] {
  if (relapseRisk === "urgent") return ["safety", "stabilization"];
  if (relapseRisk === "high") return ["stabilization", "emotion-regulation"];
  if (relapseRisk === "moderate") return ["emotion-regulation", "cbt"];
  return ["timeline", "identity"];
}

/** Build maintenance practice tasks from the plan. */
export function maintenancePracticeTasks(core: RelapsePreventionCore, ctx: { userId: string; sessionId: string; sourceId?: string }): PracticeTaskInput[] {
  const tasks: PracticeTaskInput[] = [];
  if (core.practiceMaintenancePlan.minimumDailyPractice) {
    tasks.push({
      userId: ctx.userId, sessionId: ctx.sessionId, sourceType: "relapse-prevention", sourceId: ctx.sourceId,
      title: "每日最小维护", description: core.practiceMaintenancePlan.fallbackWhenLowEnergy ? `低能量时：${core.practiceMaintenancePlan.fallbackWhenLowEnergy}` : "",
      steps: [core.practiceMaintenancePlan.minimumDailyPractice], difficulty: "easy", completionMetric: "每天完成最小维护",
    });
  }
  if (core.identityMaintenance.minimumEvidenceAction) {
    tasks.push({
      userId: ctx.userId, sessionId: ctx.sessionId, sourceType: "relapse-prevention", sourceId: ctx.sourceId,
      title: "身份维护证据", description: core.identityMaintenance.newIdentityReminder, steps: [core.identityMaintenance.minimumEvidenceAction], difficulty: "easy", completionMetric: "记录一条身份证据",
    });
  }
  return tasks;
}
