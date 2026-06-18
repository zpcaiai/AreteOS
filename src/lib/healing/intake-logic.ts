// ─────────────── Healing OS · Intake pure logic (deterministic) ───────────────
// Heuristic maintaining-loop detection + next-skill routing. Pure (no LLM/DB) so
// it's testable and gives the LLM a deterministic backbone to refine. The intake
// service merges these with the model's richer narrative.

import {
  type MaintainingLoop,
  type MaintainingLoopKind,
  type NextSkill,
  type MentalStateIntakeInput,
} from "../domain/mental-state";
import type { RiskLevel } from "../domain/risk";

type LoopProbe = Pick<MentalStateIntakeInput, "freeText" | "ratings" | "checkboxes">;

interface LoopDef {
  kind: MaintainingLoopKind;
  loopName: string;
  description: string;
  shortTermReward: string;
  longTermCost: string;
  test: (p: LoopProbe, text: string) => boolean;
}

const r = (p: LoopProbe, k: keyof NonNullable<LoopProbe["ratings"]>) => p.ratings?.[k];
const cb = (p: LoopProbe, k: keyof NonNullable<LoopProbe["checkboxes"]>) => p.checkboxes?.[k] === true;

// Each loop: short-term relief, long-term cost — the engine of "maintenance".
const LOOPS: LoopDef[] = [
  {
    kind: "anxiety_avoidance",
    loopName: "焦虑-回避 / Anxiety–avoidance",
    description: "焦虑升高 → 回避 → 短期缓解 → 长期焦虑更强。",
    shortTermReward: "立刻降低焦虑",
    longTermCost: "回避面越来越大，恐惧被强化",
    test: (p, t) => cb(p, "avoidance") || /回避|逃避|不敢|躲|avoid|escap/i.test(t),
  },
  {
    kind: "perfectionism_procrastination",
    loopName: "完美主义-拖延 / Perfectionism–procrastination",
    description: "必须完美 → 害怕开始 → 拖延 → 自责 → 更怕开始。",
    shortTermReward: "暂时避免失败的风险",
    longTermCost: "任务堆积、自责加重、开始概率更低",
    test: (p, t) => cb(p, "procrastination") || /拖延|完美|必须做好|不敢开始|procrastinat|perfection/i.test(t),
  },
  {
    kind: "shame_hiding",
    loopName: "羞耻-隐藏 / Shame–hiding",
    description: "感到羞耻 → 隐藏真实自己 → 缺少连接 → 更羞耻。",
    shortTermReward: "避免被看见和评价",
    longTermCost: "孤立加深，真实连接减少",
    test: (p, t) => (r(p, "shame") ?? 0) >= 6 || /羞耻|丢脸|见不得人|躲起来|不敢让.*看到|shame|humiliat/i.test(t),
  },
  {
    kind: "depression_inactivity",
    loopName: "抑郁-低活动 / Depression–inactivity",
    description: "无力 → 不行动 → 缺少正反馈 → 更无力。",
    shortTermReward: "省力、避免消耗",
    longTermCost: "成就感与意义来源枯竭，动力进一步下降",
    test: (p, t) =>
      cb(p, "numbness") || (r(p, "energy") ?? 10) <= 3 || (r(p, "mood") ?? 10) <= 3 || /没动力|提不起劲|无力|什么都不想做|麻木|numb|no energy|hopeless/i.test(t),
  },
  {
    kind: "people_pleasing_resentment",
    loopName: "讨好-怨恨 / People-pleasing–resentment",
    description: "不敢拒绝 → 过度付出 → 内心怨恨 → 关系疲惫。",
    shortTermReward: "维持表面和谐，避免被讨厌",
    longTermCost: "需求长期被压抑，怨恨与疲惫累积",
    test: (p, t) => /讨好|不敢拒绝|不会拒绝|总是答应|迁就|people.?pleas|can'?t say no/i.test(t),
  },
  {
    kind: "control_anxiety",
    loopName: "控制-焦虑 / Control–anxiety",
    description: "想控制一切 → 无法控制 → 更焦虑 → 更想控制。",
    shortTermReward: "短暂的确定感",
    longTermCost: "对不确定的耐受下降，紧绷加剧",
    test: (p, t) => /控制|掌控|必须确定|反复确认|controll|need to be sure|certainty/i.test(t),
  },
  {
    kind: "rumination_paralysis",
    loopName: "反刍-瘫痪 / Rumination–paralysis",
    description: "反复想 → 没有新信息 → 行动停滞 → 更多反刍。",
    shortTermReward: "感觉在'解决问题'",
    longTermCost: "消耗精力却无行动，情绪被放大",
    test: (p, t) => cb(p, "rumination") || /反刍|反复想|停不下来|想太多|ruminat|overthink|can'?t stop thinking/i.test(t),
  },
];

/** Detect likely maintaining loops from structured + free-text intake. */
export function detectMaintainingLoops(p: LoopProbe): MaintainingLoop[] {
  const text = p.freeText ?? "";
  return LOOPS.filter((l) => l.test(p, text)).map((l) => ({
    loopName: l.loopName,
    kind: l.kind,
    description: l.description,
    shortTermReward: l.shortTermReward,
    longTermCost: l.longTermCost,
  }));
}

/**
 * Deterministic next-skill routing. Orange → stabilization-only (no deep work).
 * Green/yellow → structural (dilts/formulation) + signal-driven interventions.
 */
export function recommendNextSkills(p: LoopProbe, loops: MaintainingLoop[], risk: RiskLevel): NextSkill[] {
  if (risk === "red") return ["stabilization"];
  if (risk === "orange") return ["stabilization", "emotion-regulation"];

  const out: NextSkill[] = [];
  const text = p.freeText ?? "";
  const kinds = new Set(loops.map((l) => l.kind));
  const highEmotion =
    (p.ratings?.anxiety ?? 0) >= 7 || (p.ratings?.anger ?? 0) >= 7 || (p.ratings?.sadness ?? 0) >= 7 || (p.ratings?.shame ?? 0) >= 7 || cb(p, "panicLikeSymptoms");

  if (highEmotion) out.push("emotion-regulation");
  // Structural understanding first for green/yellow.
  out.push("dilts-map", "case-formulation");
  if (kinds.has("shame_hiding") || /我不够|没价值|我是失败|不值得/i.test(text)) out.push("core-belief");
  if (kinds.has("perfectionism_procrastination") || kinds.has("rumination_paralysis")) out.push("cbt");
  if (kinds.has("anxiety_avoidance")) out.push("exposure");
  if (kinds.has("depression_inactivity")) out.push("behavioral-activation");

  // De-dup, preserve order.
  return [...new Set(out)];
}
