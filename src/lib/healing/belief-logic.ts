// ───────────── Healing OS · Core-belief pure logic (deterministic) ─────────────
import type { BeliefNextSkill, CoreBeliefCore } from "../domain/belief";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

/** Risk-aware next-skill routing from the extracted/reconstructed beliefs. */
export function recommendBeliefNextSkills(core: CoreBeliefCore, risk: RiskLevel): BeliefNextSkill[] {
  if (risk === "orange") return ["emotion-regulation"]; // stabilization-oriented only
  const types = new Set(core.extractedBeliefs.map((b) => b.type));
  const out: BeliefNextSkill[] = [];
  if (core.extractedBeliefs.some((b) => b.emotionalImpact.length > 0)) out.push("emotion-regulation");
  if (core.behavioralExperiments.length > 0) out.push("exposure");
  out.push("cbt");
  if (types.has("protective_assumption") || types.has("rule_belief")) out.push("parts-work");
  if (types.has("identity_belief")) out.push("identity-reconstruction");
  return [...new Set(out)];
}

/** Turn each behavioral experiment into a small, trackable PracticeTask. */
export function experimentsToPracticeTasks(
  core: CoreBeliefCore,
  ctx: { userId: string; sessionId: string; sourceId?: string },
): PracticeTaskInput[] {
  return core.behavioralExperiments.map((e) => ({
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "core-belief" as const,
    sourceId: ctx.sourceId,
    title: e.experimentName,
    description: `${e.actionStep}（验证：「${e.newBeliefToTest}」）`,
    steps: [e.actionStep, ...e.reflectionQuestions],
    difficulty: e.difficulty,
    completionMetric: e.measurableOutcome,
  }));
}
