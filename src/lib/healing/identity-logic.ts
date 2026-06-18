// ───────────── Healing OS · Identity pure logic (deterministic) ─────────────
import type { IdentityMode, IdentityReconstructionCore, IdentityNextSkill } from "../domain/identity-rebuild";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

/** Orange → light identity stabilization only. */
export function resolveIdentityMode(requested: IdentityMode, risk: RiskLevel): IdentityMode {
  if (risk === "orange") return "light_identity_stabilization";
  return requested;
}

export function recommendIdentityNextSkills(core: IdentityReconstructionCore, risk: RiskLevel): IdentityNextSkill[] {
  if (risk === "orange") return ["emotion-regulation"];
  const out: IdentityNextSkill[] = ["timeline-progress", "relapse-prevention"];
  if (core.identityMap.newIdentitySeeds.some((s) => s.requiredPractices.length > 0)) out.push("exposure");
  return [...new Set(out)];
}

export function identityPracticeTask(core: IdentityReconstructionCore, ctx: { userId: string; sessionId: string; sourceId?: string }): PracticeTaskInput {
  const p = core.identityPracticeTask;
  return {
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "identity",
    sourceId: ctx.sourceId,
    title: p.title,
    description: p.description || core.dailyEvidencePlan.identityStatement,
    steps: p.steps.length ? p.steps : core.dailyEvidencePlan.sevenDayEvidenceActions.map((d) => `Day ${d.day}: ${d.action}`),
    difficulty: "easy",
    completionMetric: p.completionMetric || "记录每日身份证据",
  };
}

/** Seed the IdentityEvidence table from the daily plan (one row per day). */
export function evidencePlaceholders(core: IdentityReconstructionCore, ctx: { userId: string; sessionId: string; sourceId?: string }) {
  const stmt = core.dailyEvidencePlan.identityStatement;
  return core.dailyEvidencePlan.sevenDayEvidenceActions.map((d) => ({
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    identitySessionId: ctx.sourceId,
    identityStatement: stmt,
    evidenceAction: d.action,
  }));
}
