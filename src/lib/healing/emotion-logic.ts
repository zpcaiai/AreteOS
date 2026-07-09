// ───────────── Healing OS · Emotion-regulation pure logic (deterministic) ─────────────
import type { ArousalState, ERSkill, ERNextSkill, EmotionRegulationCore, EmotionRegulationInput } from "../domain/emotion-regulation";
import type { RiskLevel } from "../domain/risk";
import type { PracticeTaskInput } from "../domain/practice";

const HYPER = /心跳(很)?快|心跳加速|胸闷|坐立不安|发抖|愤怒|很生气|怒|惊恐|想逃|想攻击|停不下来|脑子.*停|racing|pounding|panic|can'?t stop|on edge|shaking/i;
const HYPO = /麻木|空白|空虚|无力|没力气|很困|不真实|断开|抽离|什么都不想做|提不起|numb|empty|blank|detached|shut ?down|disconnected|frozen/i;

/** Classify arousal from the free text + signals + urges. Pure. */
export function classifyArousalState(input: Pick<EmotionRegulationInput, "currentEmotionText" | "bodySignals" | "urges" | "emotions">): ArousalState {
  const text = [input.currentEmotionText, ...(input.bodySignals ?? []), ...(input.urges ?? []), ...(input.emotions ?? []).map((e) => e.name)].join(" ");
  const hyper = HYPER.test(text);
  const hypo = HYPO.test(text);
  if (hyper && hypo) return "mixed";
  if (hyper) return "hyperarousal";
  if (hypo) return "hypoarousal";
  if ((input.emotions ?? []).length || input.currentEmotionText.trim()) return "within_window";
  return "unclear";
}

/** Choose a primary regulation skill from emotion + arousal. Mirrors the spec. */
export function selectEmotionRegulationSkill(input: {
  emotions?: { name: string; intensity: number }[];
  urges?: string[];
  currentEmotionText?: string;
  arousal: ArousalState;
}): ERSkill {
  const names = [...(input.emotions ?? []).map((e) => e.name), input.currentEmotionText ?? ""].join(" ");
  const urges = (input.urges ?? []).join(" ");

  if (input.arousal === "hyperarousal") {
    if (/愤怒|生气|怒|anger|furious/i.test(names)) return "check_the_facts";
    if (/冲动|想.*(?:砸|骂|逃)|urge|impulse/i.test(urges)) return "urge_surfing";
    return "paced_breathing";
  }
  if (input.arousal === "hypoarousal") return "body_scan";
  if (/羞耻|丢脸|没用|shame|worthless/i.test(names)) return "self_validation";
  if (/焦虑|害怕|恐惧|anxiety|fear|scared/i.test(names)) return "grounding_5_4_3_2_1";
  if (/冲动|impulse/i.test(urges)) return "urge_surfing";
  return "values_micro_action";
}

export function recommendERNextSkills(core: EmotionRegulationCore, risk: RiskLevel): ERNextSkill[] {
  if (risk === "orange") return ["relapse-prevention"];
  const out: ERNextSkill[] = ["cbt"];
  if (core.emotionalStateMap.dominantEmotions.some((e) => /羞耻|shame/i.test(e.name))) out.push("core-belief");
  if (core.emotionalStateMap.dominantEmotions.some((e) => /焦虑|恐惧|anxiety|fear/i.test(e.name))) out.push("exposure");
  return [...new Set(out)];
}

export function erPracticeTask(core: EmotionRegulationCore, ctx: { userId: string; sessionId: string; sourceId?: string }): PracticeTaskInput {
  const p = core.practiceTask;
  return {
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    sourceType: "emotion-regulation",
    sourceId: ctx.sourceId,
    title: p.title,
    description: p.suggestedTiming ? `建议时机：${p.suggestedTiming}` : "",
    steps: p.steps,
    difficulty: "easy",
    completionMetric: p.completionMetric,
  };
}
