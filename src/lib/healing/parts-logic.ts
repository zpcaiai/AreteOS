// ───────────── Healing OS · Parts-work pure logic (deterministic) ─────────────
import type { PartsMode, PartsWorkCore, PartsNextSkill } from "../domain/parts-work";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

/** Orange → light check-in only; otherwise honor requested mode. */
export function resolvePartsWorkMode(requested: PartsMode, risk: RiskLevel): PartsMode {
  if (risk === "orange") return "light_parts_checkin";
  return requested;
}

export function recommendPartsNextSkills(core: PartsWorkCore, risk: RiskLevel): PartsNextSkill[] {
  if (risk === "orange") return ["emotion-regulation", "stabilization"];
  const types = new Set(core.partsMap.map((p) => p.partType));
  const out: PartsNextSkill[] = [];
  if (types.has("wounded_child") || types.has("angry_part") || types.has("numb_part")) out.push("emotion-regulation");
  if (types.has("inner_critic") || types.has("perfectionist")) out.push("core-belief");
  if (types.has("avoider") || types.has("fearful_part")) out.push("exposure");
  out.push("identity-reconstruction");
  return [...new Set(out)];
}

export function partsPracticeTask(core: PartsWorkCore, ctx: { userId: string; sessionId: string; sourceId?: string }): PracticeTaskInput {
  const p = core.practiceTask;
  return {
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "parts-work",
    sourceId: ctx.sourceId,
    title: p.title,
    description: p.safetyStopRule ? `停止规则：${p.safetyStopRule}` : "",
    steps: p.steps,
    difficulty: "easy",
    completionMetric: p.duration ? `用时约 ${p.duration}` : "完成一次内在 check-in",
  };
}
