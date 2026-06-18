// ───────────── Healing OS · CBT pure logic (deterministic) ─────────────
import type { CBTMode, CBTCore, CBTNextSkill } from "../domain/cbt";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

/** Infer a sensible CBT mode from the situation text when none is given. */
export function detectCBTMode(situation: string, explicit?: CBTMode): CBTMode {
  if (explicit) return explicit;
  const t = situation.toLowerCase();
  if (/反刍|反复想|停不下来|想太多|ruminat|overthink/i.test(t)) return "rumination_interrupt";
  if (/拖延|一直拖|总是拖|总在拖|拖着|迟迟不|不敢开始|procrastinat|can'?t start|keep putting off/i.test(t)) return "procrastination_breakdown";
  if (/没动力|提不起劲|什么都不想做|no energy|no motivation|hopeless/i.test(t)) return "behavioral_activation";
  return "thought_record";
}

/** Risk-aware next-skill routing from the CBT result. */
export function recommendCBTNextSkills(core: CBTCore, risk: RiskLevel): CBTNextSkill[] {
  if (risk === "orange") return ["emotion-regulation"];
  const out: CBTNextSkill[] = [];
  const highEmotion = core.cbtMap.emotions.some((e) => e.intensity >= 7);
  if (highEmotion) out.push("emotion-regulation");
  if (core.behaviorPlan.planType === "exposure_step" || core.behaviorPlan.planType === "behavioral_experiment") out.push("exposure");
  out.push("core-belief");
  return [...new Set(out)];
}

/** A CBT behavior plan becomes one trackable PracticeTask. */
export function behaviorPlanToPracticeTask(
  core: CBTCore,
  ctx: { userId: string; sessionId: string; sourceId?: string },
): PracticeTaskInput {
  const p = core.behaviorPlan;
  return {
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "cbt",
    sourceId: ctx.sourceId,
    title: p.title,
    description: p.copingPlan ? `${p.expectedObstacle ? `可能的阻碍：${p.expectedObstacle}。` : ""}应对：${p.copingPlan}` : p.expectedObstacle,
    steps: p.steps,
    difficulty: p.difficulty,
    completionMetric: p.measurement,
  };
}
