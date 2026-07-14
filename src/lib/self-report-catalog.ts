// Life-outcome dimensions for periodic self-report. These measure real life quality
// (not internal engine scores), so the product can show longitudinal *evidence of change*
// against a personal baseline — the most defensible form of value. Pure + client-safe.

export interface Bi { zh: string; en: string }
export interface OutcomeDimension { key: string; name: Bi; help: Bi }

export const OUTCOME_DIMENSIONS: OutcomeDimension[] = [
  { key: "energy",        name: { zh: "精力", en: "Energy" },            help: { zh: "近期的身体与精神能量", en: "Recent physical & mental energy" } },
  { key: "clarity",       name: { zh: "清晰与专注", en: "Clarity & focus" }, help: { zh: "能否清楚地想事、专注地做事", en: "Can you think clearly and focus?" } },
  { key: "relationships", name: { zh: "关系", en: "Relationships" },      help: { zh: "与重要的人之间的连接质量", en: "Connection quality with people who matter" } },
  { key: "meaning",       name: { zh: "意义感", en: "Meaning" },          help: { zh: "所做之事是否有意义、有方向", en: "Does what you do feel meaningful?" } },
  { key: "calm",          name: { zh: "平静", en: "Calm" },               help: { zh: "情绪的平稳程度(高=更平静)", en: "Emotional steadiness (high = calmer)" } },
  { key: "progress",      name: { zh: "进展", en: "Progress" },           help: { zh: "朝重要目标推进的感受", en: "Sense of progress toward what matters" } },
];

export const OUTCOME_KEYS = OUTCOME_DIMENSIONS.map((d) => d.key);
export const OUTCOME_BY_KEY: Record<string, OutcomeDimension> = Object.fromEntries(
  OUTCOME_DIMENSIONS.map((d) => [d.key, d]),
);
export const SELF_REPORT_MIN = 0;
export const SELF_REPORT_MAX = 10;
