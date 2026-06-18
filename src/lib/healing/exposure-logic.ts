// ───────────── Healing OS · Exposure pure logic (deterministic safety) ─────────────
import type { ExposureInput, ExposureCore, ExposureNextSkill } from "../domain/exposure";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

export type Difficulty = "easy" | "medium" | "hard";

/**
 * The hard safety gate for exposure: refuse trauma exposure, dangerous real-world
 * tasks, OCD-ERP substitution, self/other-harm, or confronting an abuser. Pure +
 * tested — does NOT depend on the model.
 */
export function checkExposureContraindications(input: ExposureInput): { blocked: boolean; reason?: string } {
  const t = [input.avoidanceProblem, input.targetBehavior ?? "", input.fearPrediction ?? "", ...(input.currentAvoidanceBehaviors ?? [])].join(" ");
  if (/创伤|闪回|回忆那次|强迫自己回忆|被虐待|被侵害|ptsd|trauma|flash ?back|relive|the assault|the abuse/i.test(t)) return { blocked: true, reason: "trauma" };
  if (/自残|自杀|想死|伤害(自己|别人|他)|报复|找.*(施害者|加害者|对峙)|confront (my )?(abuser|attacker)|self-?harm|suicid|hurt (myself|someone)|dangerous|危险(场所|的人)|违法|illegal/i.test(t)) return { blocked: true, reason: "danger" };
  if (/强迫症|强迫行为|反复(洗|检查|确认)的仪式|ocd|compulsion|ritual|erp\b/i.test(t)) return { blocked: true, reason: "ocd" };
  return { blocked: false };
}

/**
 * Enforce the gradual-ladder invariants: cap auto-generated predicted distress
 * at 7/10 and keep the ladder ordered. The SELECTED first experiment is never
 * "hard" (see isSelectedDifficultyAllowed).
 */
export function clampHierarchy(core: ExposureCore): ExposureCore {
  const hierarchy = core.hierarchy
    .map((h) => ({ ...h, predictedDistress: Math.min(7, Math.max(0, h.predictedDistress)) }))
    .sort((a, b) => a.level - b.level);
  return { ...core, hierarchy };
}

/** Whether a selected experiment difficulty is allowed (never "hard" first). */
export function isSelectedDifficultyAllowed(d: Difficulty): boolean {
  return d !== "hard";
}

export function recommendExposureNextSkills(core: ExposureCore, risk: RiskLevel): ExposureNextSkill[] {
  if (risk === "orange") return ["emotion-regulation"];
  const out: ExposureNextSkill[] = ["emotion-regulation"];
  if (core.avoidanceLoop.fearPrediction) out.push("core-belief");
  out.push("relapse-prevention");
  return [...new Set(out)];
}

export function exposurePracticeTask(core: ExposureCore, ctx: { userId: string; sessionId: string; sourceId?: string }): PracticeTaskInput {
  const e = core.selectedExperiment;
  return {
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "exposure",
    sourceId: ctx.sourceId,
    title: e.title,
    description: `验证：「${e.newLearningTarget}」。${e.stopRules.length ? `停止规则：${e.stopRules.join("；")}` : ""}`,
    steps: e.actionSteps,
    difficulty: isSelectedDifficultyAllowed("medium") ? "medium" : "easy",
    completionMetric: e.measurement.actualOutcome,
  };
}
