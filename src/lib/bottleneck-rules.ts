// Bottleneck Diagnosis — pure rule engine. Growth is limited by the strongest
// constraint; this maps observed signals onto 16 bottleneck types (rules first,
// AI refines later). No I/O imports, fully unit-testable.

export const clamp01 = (x: number): number => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);

export interface Bi { zh: string; en: string }
export interface BottleneckType { key: string; name: Bi; question: Bi }

export const BOTTLENECKS: BottleneckType[] = [
  { key: "mission", name: { zh: "使命瓶颈", en: "Mission" }, question: { zh: "你知道这为何重要吗?", en: "Do you know why this matters?" } },
  { key: "identity", name: { zh: "身份瓶颈", en: "Identity" }, question: { zh: "你知道自己要成为谁吗?", en: "Do you know who you're becoming?" } },
  { key: "value_conflict", name: { zh: "价值冲突", en: "Value Conflict" }, question: { zh: "你有相互竞争的优先级吗?", en: "Do you have competing priorities?" } },
  { key: "belief", name: { zh: "信念瓶颈", en: "Belief" }, question: { zh: "你持有限制性信念吗?", en: "Do you hold limiting beliefs?" } },
  { key: "motivation", name: { zh: "动机瓶颈", en: "Motivation" }, question: { zh: "自主/胜任/联结是否偏低?", en: "Is autonomy/competence/relatedness low?" } },
  { key: "energy", name: { zh: "能量瓶颈", en: "Energy" }, question: { zh: "你缺乏身心能量吗?", en: "Do you lack physical/mental energy?" } },
  { key: "focus", name: { zh: "专注瓶颈", en: "Focus" }, question: { zh: "你难以维持注意力吗?", en: "Can you sustain attention?" } },
  { key: "skill", name: { zh: "技能瓶颈", en: "Skill" }, question: { zh: "你缺少所需能力吗?", en: "Do you lack a required capability?" } },
  { key: "judgment", name: { zh: "判断瓶颈", en: "Judgment" }, question: { zh: "你的决策质量如何?", en: "Are your decisions poor?" } },
  { key: "environment", name: { zh: "环境瓶颈", en: "Environment" }, question: { zh: "环境是否强化了错误行为?", en: "Does your environment reinforce the wrong behavior?" } },
  { key: "habit", name: { zh: "习惯瓶颈", en: "Habit" }, question: { zh: "目标行为设计得好吗?", en: "Is the behavior well designed?" } },
  { key: "shadow", name: { zh: "阴影瓶颈", en: "Shadow" }, question: { zh: "回避/恐惧/拖延在作祟吗?", en: "Avoidance, fear, or procrastination?" } },
  { key: "leverage", name: { zh: "杠杆瓶颈", en: "Leverage" }, question: { zh: "努力但产出不可扩展吗?", en: "Hard work without scalable output?" } },
  { key: "asset", name: { zh: "资产瓶颈", en: "Asset" }, question: { zh: "你创造持久资产吗?", en: "Do you create durable assets?" } },
  { key: "relationship", name: { zh: "关系瓶颈", en: "Relationship" }, question: { zh: "你缺乏支持/反馈/同盟吗?", en: "Do you lack support/feedback/community?" } },
  { key: "antifragility", name: { zh: "反脆弱瓶颈", en: "Antifragility" }, question: { zh: "你是否过度依赖/脆弱?", en: "Are you overdependent or fragile?" } },
];

export const BOTTLENECK_BY_KEY: Record<string, BottleneckType> = Object.fromEntries(BOTTLENECKS.map((b) => [b.key, b]));

/** Signal flag -> candidate bottlenecks (the spec's diagnostic rule map). */
export const SIGNAL_RULES: { signal: string; label: Bi; targets: string[] }[] = [
  { signal: "clearGoalsNoAction", label: { zh: "目标清晰却没有持续行动", en: "Clear goals but no consistent action" }, targets: ["motivation", "energy", "environment", "habit"] },
  { signal: "consumesNoOutput", label: { zh: "大量输入却没有产出", en: "Consume a lot, produce nothing" }, targets: ["asset", "shadow", "focus"] },
  { signal: "changesGoalsOften", label: { zh: "频繁更换目标", en: "Change goals frequently" }, targets: ["mission", "identity", "value_conflict"] },
  { signal: "manyHoursNoProgress", label: { zh: "投入很多时间却没进展", en: "Many hours, no progress" }, targets: ["leverage", "judgment", "skill"] },
  { signal: "startsNoFinish", label: { zh: "开始却完不成", en: "Start but don't finish" }, targets: ["shadow", "energy", "habit"] },
  { signal: "stuckDespiteEffort", label: { zh: "努力却依然卡住", en: "Stuck despite effort" }, targets: ["belief", "judgment"] },
  { signal: "unclearWhy", label: { zh: "说不清为什么做", en: "Can't say why it matters" }, targets: ["mission"] },
  { signal: "lowEnergy", label: { zh: "长期低能量", en: "Chronically low energy" }, targets: ["energy"] },
  { signal: "cantFocus", label: { zh: "无法专注", en: "Cannot focus" }, targets: ["focus"] },
  { signal: "avoidsImportantWork", label: { zh: "回避最重要的工作", en: "Avoid the important work" }, targets: ["shadow"] },
  { signal: "noFeedbackLoop", label: { zh: "缺少反馈回路", en: "No feedback loop" }, targets: ["skill", "judgment"] },
  { signal: "isolatedNoSupport", label: { zh: "孤立、缺少支持", en: "Isolated, no support" }, targets: ["relationship"] },
  { signal: "overDependent", label: { zh: "过度依赖单一来源", en: "Over-dependent on one source" }, targets: ["antifragility"] },
  { signal: "limitingBeliefs", label: { zh: "存在限制性信念", en: "Holds limiting beliefs" }, targets: ["belief"] },
  { signal: "valuesConflict", label: { zh: "价值观相互冲突", en: "Conflicting values" }, targets: ["value_conflict"] },
  { signal: "unclearIdentity", label: { zh: "不清楚要成为谁", en: "Unclear who to become" }, targets: ["identity"] },
];

export interface RankedBottleneck {
  key: string;
  name: Bi;
  question: Bi;
  score: number; // raw weight
  confidence: number; // 0..1
}

/** Tally rule weights from active signals; return bottlenecks ranked by score. */
export function diagnose(activeSignals: string[]): RankedBottleneck[] {
  const tally: Record<string, number> = {};
  const active = new Set(activeSignals);
  for (const rule of SIGNAL_RULES) {
    if (!active.has(rule.signal)) continue;
    for (const t of rule.targets) tally[t] = (tally[t] ?? 0) + 1;
  }
  const ranked = Object.entries(tally).map(([key, score]) => {
    const b = BOTTLENECK_BY_KEY[key];
    return { key, name: b.name, question: b.question, score, confidence: clamp01(score / (score + 2)) };
  });
  return ranked.sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));
}
