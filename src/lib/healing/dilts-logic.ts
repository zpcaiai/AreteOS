// ─────────────── Healing OS · Dilts pure logic (deterministic) ───────────────
// Intervention-path recommender + causal-loop builder. Pure (no LLM/DB). The
// service merges the model's richer formulation with these deterministic
// guarantees: the path is always ordered + non-empty, the loop always has ≥3
// edges climbing the Dilts levels.

import {
  type DiltsMap,
  type FiveP,
  type InterventionStep,
  type CausalLoopEdge,
} from "../domain/dilts";

const joinText = (xs: string[]) => xs.join(" ").toLowerCase();

/**
 * Recommend an ordered intervention path from the formulation. Mirrors the
 * spec's heuristic: regulate first if affect is high, then expose avoidance,
 * then reconstruct belief, then parts work, then identity.
 */
export function recommendInterventionPath(
  map: DiltsMap,
  five: FiveP,
  ctx: { dominantEmotions?: string[] } = {},
): InterventionStep[] {
  const behaviorText = joinText(map.behavior.map((b) => `${b.item} ${b.shortTermFunction} ${b.longTermCost}`));
  const beliefText = joinText(map.beliefAndValues.map((b) => `${b.belief} ${b.impact}`));
  const perpText = joinText(five.perpetuatingFactors);
  const emotions = joinText(ctx.dominantEmotions ?? []);

  const steps: { skill: string; reason: string }[] = [];

  const highEmotion =
    /焦虑|恐惧|害怕|愤怒|生气|羞耻|惊恐|anx|fear|anger|shame|panic/i.test(emotions + " " + behaviorText);
  if (highEmotion) steps.push({ skill: "emotion-regulation", reason: "情绪强度较高，先稳定情绪再处理结构。" });

  const hasAvoidance = /回避|逃避|拖延|沉默|退缩|avoid|procrastinat|withdraw/i.test(behaviorText + " " + perpText);
  if (hasAvoidance) steps.push({ skill: "exposure", reason: "存在回避循环，用分级行为实验打破强化。" });

  const hasStrongBelief = map.beliefAndValues.some((b) => b.type === "core_belief" || b.type === "conditional_belief");
  if (hasStrongBelief) steps.push({ skill: "core-belief", reason: "存在核心/条件信念，需重构为可验证的新信念。" });

  const hasCriticOrPleasing = /讨好|批评|自责|应该|必须|please|critic|self-?blame/i.test(behaviorText + " " + beliefText);
  if (hasCriticOrPleasing) steps.push({ skill: "parts-work", reason: "出现内在批评者/讨好者，用部分工作降低内部对立。" });

  const hasIdentity = map.identity.length > 0;
  if (hasIdentity) steps.push({ skill: "identity-reconstruction", reason: "旧身份叙事在维持问题，需建立新身份证据。" });

  // Always give at least a structural CBT step if nothing else fired.
  if (steps.length === 0) steps.push({ skill: "cbt", reason: "从认知-行为层面入手，建立可操作的改变。" });

  return steps.map((s, i) => ({ order: i + 1, skill: s.skill, reason: s.reason }));
}

/**
 * Build a causal loop climbing the Dilts levels:
 *   environment → (behavior) → belief → identity → mission.
 * Always ≥3 edges; uses the first item at each populated level, falling back to
 * generic nodes so the graph is never empty.
 */
export function buildCausalLoop(map: DiltsMap, five: FiveP): CausalLoopEdge[] {
  const env = map.environment[0]?.item ?? "触发场景";
  const beh = map.behavior[0];
  const belief = map.beliefAndValues[0]?.belief ?? (five.perpetuatingFactors[0] ?? "维持性信念");
  const identity = map.identity[0]?.narrative ?? "旧身份叙事";
  const mission = map.mission[0]?.blockedCalling;

  const edges: CausalLoopEdge[] = [];
  const behavior = beh?.item ?? "回避行为";

  edges.push({
    from: env,
    relation: "activates",
    to: behavior,
    explanation: `${env}触发了${behavior}。`,
  });
  edges.push({
    from: behavior,
    relation: "reinforces",
    to: belief,
    explanation: beh?.longTermCost
      ? `${behavior}短期${beh.shortTermFunction || "缓解"}，长期${beh.longTermCost}，强化「${belief}」。`
      : `${behavior}在长期上强化了「${belief}」。`,
  });
  edges.push({
    from: belief,
    relation: "shapes",
    to: identity,
    explanation: `「${belief}」逐渐沉淀为身份叙事「${identity}」。`,
  });
  if (mission) {
    edges.push({
      from: identity,
      relation: "blocks",
      to: mission,
      explanation: `身份叙事「${identity}」阻挡了${mission}。`,
    });
  }
  return edges;
}
