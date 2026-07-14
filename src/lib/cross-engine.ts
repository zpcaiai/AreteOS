// Cross-engine reasoning. The moat isn't any single engine — it's connecting patterns
// ACROSS them: "you're steady on habits (execution) but meaning is sliding (identity) —
// you may be climbing the wrong wall." Pure rules over a normalized signal set, so it is
// fully unit-testable and deterministic. The service layer assembles the signals.

export interface Bi { zh: string; en: string }
export type Domain =
  | "wellbeing" | "execution" | "thinking" | "identity" | "relationships" | "diagnose";

export interface EngineSignals {
  // Growth factors 0..1 (from the live scoring math).
  habitConsistency?: number;
  reflection?: number;
  decisionQuality?: number;
  mentalModelUsage?: number;
  firstPrinciple?: number;
  // Self-report life outcomes 0..10 (from /outcomes).
  selfReport?: Partial<Record<"energy" | "clarity" | "relationships" | "meaning" | "calm" | "progress", number>>;
  // Self-report deltas vs baseline (can be negative).
  selfReportDelta?: Partial<Record<"energy" | "clarity" | "relationships" | "meaning" | "calm" | "progress", number>>;
  // Stated-vs-enacted integrity gap 0..1 (from the evidence engine).
  integrityGap?: number;
  // The current primary bottleneck label, if diagnosed.
  bottleneck?: string;
}

export type BridgeSeverity = "info" | "watch" | "act";
export interface BridgeInsight {
  id: string;
  from: Domain;
  to: Domain;
  severity: BridgeSeverity;
  score: number; // 0..1 strength, for ranking
  title: Bi;
  explanation: Bi;
  action: Bi;
  href: string;
}

const has = (n: number | undefined): n is number => typeof n === "number" && !Number.isNaN(n);

interface Rule {
  id: string;
  from: Domain;
  to: Domain;
  href: string;
  title: Bi;
  action: Bi;
  /** Returns 0 (no fire) or a strength 0..1, plus a context-filled explanation. */
  evaluate: (s: EngineSignals) => { score: number; explanation: Bi } | null;
}

const sev = (score: number): BridgeSeverity => (score >= 0.66 ? "act" : score >= 0.4 ? "watch" : "info");

// Each rule links a pattern in one domain to an effect in another. Thresholds are
// deliberately conservative so an insight only surfaces when the link is real.
const RULES: Rule[] = [
  {
    id: "calm-vs-execution", from: "wellbeing", to: "execution", href: "/stabilization",
    title: { zh: "情绪未稳却在硬推执行", en: "Pushing execution before you're steady" },
    action: { zh: "先做一次稳定化，再加速习惯与深度工作。", en: "Run a stabilization pass before accelerating habits/deep work." },
    evaluate: (s) => {
      if (!has(s.selfReport?.calm) || !has(s.habitConsistency)) return null;
      const calmLow = (10 - s.selfReport!.calm!) / 10; // 0..1
      const pushing = s.habitConsistency!;
      const score = calmLow * pushing;
      if (score < 0.35) return null;
      return { score, explanation: { zh: "平静度偏低，但你仍在高强度维持习惯——不稳的地基会让产出反复。", en: "Calm is low while you keep grinding habits — an unstable base makes output fragile." } };
    },
  },
  {
    id: "energy-vs-judgment", from: "wellbeing", to: "thinking", href: "/decisions",
    title: { zh: "精力透支正在侵蚀判断", en: "Low energy is eroding judgment" },
    action: { zh: "先恢复精力，再做重大决策或复杂建模。", en: "Restore energy before major decisions or heavy modeling." },
    evaluate: (s) => {
      if (!has(s.selfReport?.energy)) return null;
      const energyLow = (10 - s.selfReport!.energy!) / 10;
      const demand = Math.max(s.decisionQuality ?? 0, s.mentalModelUsage ?? 0);
      const score = energyLow * (0.5 + 0.5 * demand);
      if (score < 0.4) return null;
      return { score, explanation: { zh: "精力低时，判断质量与复杂思考最先下降——把难决策移到状态好的时段。", en: "Judgment degrades first under low energy — move hard decisions to higher-energy windows." } };
    },
  },
  {
    id: "progress-vs-relationships", from: "execution", to: "relationships", href: "/life-capital",
    title: { zh: "在推进目标，但关系资本在流失", en: "Progress is up, relationships are down" },
    action: { zh: "把一次深度工作换成一次重要关系的投入。", en: "Trade one deep-work block for an investment in a key relationship." },
    evaluate: (s) => {
      if (!has(s.selfReport?.relationships)) return null;
      const relLow = (10 - s.selfReport!.relationships!) / 10;
      const pushing = Math.max(s.habitConsistency ?? 0, (s.selfReport?.progress ?? 0) / 10);
      const score = relLow * pushing;
      if (score < 0.4) return null;
      return { score, explanation: { zh: "你在向前推进，但关系维度偏低——单一维度的胜利会以关系资本为代价。", en: "You're advancing, but relationships lag — single-axis wins often bill the relationship account." } };
    },
  },
  {
    id: "habits-vs-meaning", from: "execution", to: "identity", href: "/telos",
    title: { zh: "习惯很稳，但意义在下滑", en: "Habits steady, but meaning is slipping" },
    action: { zh: "回到 Telos/身份，检查你是否在爬对的墙。", en: "Return to Telos/identity — check you're climbing the right wall." },
    evaluate: (s) => {
      const meaningDrop = has(s.selfReportDelta?.meaning) ? Math.max(0, -s.selfReportDelta!.meaning!) / 5 : (has(s.selfReport?.meaning) ? (10 - s.selfReport!.meaning!) / 10 : NaN);
      if (Number.isNaN(meaningDrop) || !has(s.habitConsistency)) return null;
      const score = meaningDrop * s.habitConsistency!;
      if (score < 0.35) return null;
      return { score, explanation: { zh: "执行很稳，但意义感在降——高效地爬错的墙，是最贵的错误。", en: "Execution is steady while meaning falls — efficiently climbing the wrong wall is the costliest error." } };
    },
  },
  {
    id: "reflection-vs-clarity", from: "thinking", to: "wellbeing", href: "/reflection",
    title: { zh: "缺少反思正在拉低清晰度", en: "Too little reflection is lowering clarity" },
    action: { zh: "本周做一次结构化反思，把混乱变成信号。", en: "Do one structured reflection this week to turn noise into signal." },
    evaluate: (s) => {
      if (!has(s.reflection) || !has(s.selfReport?.clarity)) return null;
      const reflLow = 1 - s.reflection!;
      const clarityLow = (10 - s.selfReport!.clarity!) / 10;
      const score = reflLow * clarityLow;
      if (score < 0.3) return null;
      return { score, explanation: { zh: "反思频率低且清晰度低——两者相互强化，一次复盘常能同时抬升。", en: "Low reflection and low clarity reinforce each other — one review often lifts both." } };
    },
  },
  {
    id: "integrity-vs-identity", from: "identity", to: "diagnose", href: "/evidence",
    title: { zh: "言行差距在削弱身份进化", en: "The say-do gap is stalling identity" },
    action: { zh: "选一个价值观，本周用一次可见行动缩小差距。", en: "Pick one value and close the gap with one visible action this week." },
    evaluate: (s) => {
      if (!has(s.integrityGap)) return null;
      const score = s.integrityGap!;
      if (score < 0.4) return null;
      return { score, explanation: { zh: "你声称的与你做到的之间差距偏大——身份靠证据进化，不靠宣言。", en: "The gap between stated and enacted is wide — identity evolves on evidence, not declarations." } };
    },
  },
  {
    id: "clarity-vs-bottleneck", from: "thinking", to: "diagnose", href: "/bottlenecks",
    title: { zh: "想得清却没推进：瓶颈在别处", en: "Clear thinking, no progress — the bottleneck is elsewhere" },
    action: { zh: "去瓶颈诊断，找出真正的约束点。", en: "Run bottleneck diagnosis to find the true constraint." },
    evaluate: (s) => {
      if (!has(s.selfReport?.clarity) || !has(s.selfReport?.progress)) return null;
      const clarityHigh = s.selfReport!.clarity! / 10;
      const progressLow = (10 - s.selfReport!.progress!) / 10;
      const score = clarityHigh * progressLow;
      if (score < 0.45) return null;
      const bn = s.bottleneck ? (s.bottleneck) : "";
      return { score, explanation: { zh: `清晰度高但进展低——约束不在思考。${bn ? `当前诊断:${bn}。` : ""}`, en: `High clarity, low progress — the constraint isn't thinking.${bn ? ` Current diagnosis: ${bn}.` : ""}` } };
    },
  },
  {
    id: "energy-calm-codrop", from: "wellbeing", to: "execution", href: "/outcomes",
    title: { zh: "平静与精力同时下滑：优先恢复", en: "Calm and energy dropping together — recover first" },
    action: { zh: "暂缓扩张，本周把恢复当作首要任务。", en: "Pause expansion; make recovery this week's priority." },
    evaluate: (s) => {
      if (!has(s.selfReportDelta?.calm) || !has(s.selfReportDelta?.energy)) return null;
      const calmDrop = Math.max(0, -s.selfReportDelta!.calm!) / 5;
      const energyDrop = Math.max(0, -s.selfReportDelta!.energy!) / 5;
      const score = Math.min(1, (calmDrop + energyDrop) / 1.2);
      if (score < 0.4) return null;
      return { score, explanation: { zh: "相对基线,平静与精力同时走低——这是过载的早期信号,先减速。", en: "Both calm and energy are below baseline — an early overload signal; slow down first." } };
    },
  },
];

/** Derive ranked cross-engine bridge insights from a normalized signal set. */
export function deriveBridgeInsights(s: EngineSignals, limit = 6): BridgeInsight[] {
  const out: BridgeInsight[] = [];
  for (const r of RULES) {
    const hit = r.evaluate(s);
    if (!hit || hit.score <= 0) continue;
    const score = Math.max(0, Math.min(1, hit.score));
    out.push({ id: r.id, from: r.from, to: r.to, severity: sev(score), score, title: r.title, action: r.action, explanation: hit.explanation, href: r.href });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export const CROSS_ENGINE_RULE_IDS = RULES.map((r) => r.id);
