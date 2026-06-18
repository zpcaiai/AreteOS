// Healing OS · cognitive-distortion dictionary (bilingual labels + Socratic Qs).
export const COGNITIVE_DISTORTIONS = [
  "catastrophizing",
  "mind_reading",
  "all_or_nothing",
  "overgeneralization",
  "emotional_reasoning",
  "should_statements",
  "labeling",
  "personalization",
  "discounting_positive",
  "fortune_telling",
  "mental_filter",
] as const;
export type CognitiveDistortion = (typeof COGNITIVE_DISTORTIONS)[number];

export const DISTORTION_DICT: Record<CognitiveDistortion, { zh: string; en: string; question: string }> = {
  catastrophizing: { zh: "灾难化", en: "Catastrophizing", question: "最坏结果真的有多大概率？有没有更可能的中间结果？" },
  mind_reading: { zh: "读心术", en: "Mind reading", question: "我有什么证据证明对方真的这样想？" },
  all_or_nothing: { zh: "非黑即白", en: "All-or-nothing", question: "有没有 0 和 100 之间的中间状态？" },
  overgeneralization: { zh: "过度概括", en: "Overgeneralization", question: "这是一贯如此，还是一次具体事件？" },
  emotional_reasoning: { zh: "情绪化推理", en: "Emotional reasoning", question: "感觉强烈是否等于事实成立？" },
  should_statements: { zh: "应该化", en: "Should statements", question: "这个规则是否太绝对？能否换成更灵活的愿望？" },
  labeling: { zh: "贴标签", en: "Labeling", question: "这是一件事，还是我的整个人？" },
  personalization: { zh: "个人化", en: "Personalization", question: "还有哪些因素影响了这件事？" },
  discounting_positive: { zh: "否定积极面", en: "Discounting the positive", question: "如果朋友做到这些，我会怎样评价他？" },
  fortune_telling: { zh: "预言未来", en: "Fortune telling", question: "我是在预测，还是在基于证据判断？" },
  mental_filter: { zh: "心理过滤", en: "Mental filter", question: "我忽略了哪些中性或积极信息？" },
};

export function distortionLabel(d: string, en = false): string {
  const e = DISTORTION_DICT[d as CognitiveDistortion];
  return e ? (en ? e.en : e.zh) : d;
}
