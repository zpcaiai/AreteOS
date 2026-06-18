// ───────────────────── Healing OS · canonical journey map ─────────────────────
// One source of truth tying every skill key (as emitted in nextRecommendedSkills
// / recommendedInterventionPath / suggestedNextSkills) to its page + label +
// phase. Used by the hub and the clickable next-step links so the whole OS is a
// navigable closed loop. Pure data — safe to import in client components.

export interface JourneyStage {
  key: string;
  path: string;
  zh: string;
  en: string;
  descZh: string;
  descEn: string;
}

export type HealingPhase = { id: string; zh: string; en: string; stages: JourneyStage[] };

export const HEALING_PHASES: HealingPhase[] = [
  {
    id: "assess",
    zh: "一、评估与概念化",
    en: "1 · Assess & formulate",
    stages: [
      { key: "safety", path: "/safety", zh: "安全与求助", en: "Safety & support", descZh: "危机分流，永远先行", descEn: "Crisis triage — always first" },
      { key: "intake", path: "/healing", zh: "状态评估", en: "Mental state intake", descZh: "当前心理画像与维持循环", descEn: "Current snapshot + maintaining loops" },
      { key: "dilts-map", path: "/healing", zh: "Dilts 六层地图 + 5P", en: "Dilts map + 5P", descZh: "把问题映射成形成机制", descEn: "Map the problem to its mechanism" },
    ],
  },
  {
    id: "intervene",
    zh: "二、核心干预",
    en: "2 · Core intervention",
    stages: [
      { key: "core-belief", path: "/core-belief", zh: "核心信念重构", en: "Core belief", descZh: "找到并重构底层信念", descEn: "Surface and reshape the belief" },
      { key: "cbt", path: "/cbt", zh: "CBT 认知行为", en: "CBT", descZh: "自动思维、扭曲、行为实验", descEn: "Thoughts, distortions, experiments" },
      { key: "emotion-regulation", path: "/emotion-regulation", zh: "情绪调节 DBT/ACT", en: "Emotion regulation", descZh: "稳定身体、降低冲动、价值行动", descEn: "Steady, de-urge, act on values" },
    ],
  },
  {
    id: "deep",
    zh: "三、深层人格模式",
    en: "3 · Deep patterns",
    stages: [
      { key: "stabilization", path: "/stabilization", zh: "创伤稳定化", en: "Stabilization", descZh: "回到当下，不深挖创伤", descEn: "Return to the present, no digging" },
      { key: "parts-work", path: "/parts-work", zh: "内在部分工作", en: "Parts work", descZh: "认识保护者，健康成人带领", descEn: "Meet protectors, lead with the adult" },
      { key: "exposure", path: "/exposure", zh: "回避与暴露", en: "Exposure", descZh: "分级行为实验打破回避", descEn: "Graded experiments break avoidance" },
    ],
  },
  {
    id: "longterm",
    zh: "四、长期成长闭环",
    en: "4 · Long-term growth loop",
    stages: [
      { key: "identity-reconstruction", path: "/identity-rebuild", zh: "身份重建", en: "Identity rebuild", descZh: "旧叙事 → 新身份证据", descEn: "Old narrative → new evidence" },
      { key: "timeline-progress", path: "/healing-timeline", zh: "疗愈时间线", en: "Healing timeline", descZh: "聚合全程，看见进展", descEn: "Aggregate the journey, see progress" },
      { key: "relapse-prevention", path: "/relapse-prevention", zh: "复发预防", en: "Relapse prevention", descZh: "预警信号 + if-then 维护", descEn: "Early warning + if-then upkeep" },
    ],
  },
];

// Skill-key → stage (incl. aliases emitted by various engines).
const ALIAS: Record<string, string> = {
  "case-formulation": "dilts-map",
  "behavioral-activation": "cbt",
  identity: "identity-reconstruction",
  "core-belief-light": "core-belief",
  "parts-work-light": "parts-work",
  "practice-task": "healing-timeline-noop",
  "safety-planning": "safety",
  timeline: "timeline-progress",
};

const BY_KEY: Record<string, JourneyStage> = (() => {
  const m: Record<string, JourneyStage> = {};
  for (const p of HEALING_PHASES) for (const s of p.stages) m[s.key] = s;
  return m;
})();

/** Resolve a skill key (or alias) to its journey stage, or null if not navigable. */
export function stageForSkill(key: string): JourneyStage | null {
  return BY_KEY[key] ?? BY_KEY[ALIAS[key] ?? ""] ?? null;
}
