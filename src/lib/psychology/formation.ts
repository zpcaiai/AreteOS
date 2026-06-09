/* ═══════════════════════════════════════════════════════════════════════════
   Formation trajectory engine — deterministic TS port of
   emotion-sphere/backend/formation_engine.py (secularized).

   Tracks an 8-dimension "behavioral tendency vector" over a history of
   sessions. These are NOT moral scores or personality types — they are
   directional trajectory signals (0.05–0.95) built from repeated patterns.
   Pure functions, no LLM, no I/O — unit-testable.
   ═══════════════════════════════════════════════════════════════════════════ */

export const DIMENSIONS = [
  "self_honesty",        // truth-seeking vs self-protection (orig: humility)
  "fear_reactivity",     // fear-driven response tendency   (higher = more reactive)
  "ego_defensiveness",   // ego/pride-driven response        (higher = more defensive)
  "emotional_stability", // regulated vs volatile
  "self_alignment",      // alignment with honest self-perception + principle
  "relational_health",   // other-oriented vs self-absorbed
  "resilience",          // recovery tendency after adversity
  "inner_clarity",       // clarity of values, reduction of confusion
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export type PatternCategory =
  | "fear" | "pride" | "shame" | "desire" | "relational" | "confusion" | "growth";

export const LOOPS = [
  "control_loop",     // fear → control → overwork → burnout (orig: fear_control)
  "avoidance_loop",   // shame → avoidance → procrastination
  "comparison_loop",  // ego → comparison → anxiety
  "impulse_loop",     // desire → impulsive action → regret
  "clarity_loop",     // truth-facing → reflection → stability (healthy)
  "unknown",
] as const;
export type Loop = (typeof LOOPS)[number];

export type Trajectory =
  | "stabilizing" | "fragmenting" | "improving_clarity"
  | "increasing_volatility" | "cyclical" | "unknown";

const BASELINE = 0.5, SCORE_MIN = 0.05, SCORE_MAX = 0.95, RECENCY_DECAY = 0.92;

type DimMap = Partial<Record<Dimension, number>>;

// Per-session raw deltas before weighting. Negative = reinforcing a reactive
// tendency or reducing stability; positive = movement toward health/clarity.
const PATTERN_IMPACT: Record<PatternCategory, DimMap> = {
  fear:       { fear_reactivity: +0.18, emotional_stability: -0.12, self_honesty: -0.05, inner_clarity: -0.08 },
  pride:      { ego_defensiveness: +0.18, self_honesty: -0.20, relational_health: -0.10, self_alignment: -0.10 },
  shame:      { self_alignment: -0.15, emotional_stability: -0.15, resilience: -0.10, inner_clarity: -0.10 },
  desire:     { resilience: -0.08, emotional_stability: -0.08, self_alignment: -0.05 },
  relational: { relational_health: -0.12, self_alignment: -0.05, emotional_stability: -0.06 },
  confusion:  { self_honesty: -0.10, inner_clarity: -0.18, emotional_stability: -0.08, self_alignment: -0.08 },
  growth:     { resilience: +0.15, self_alignment: +0.12, self_honesty: +0.08, inner_clarity: +0.10, fear_reactivity: -0.05, ego_defensiveness: -0.05 },
};

// Gains applied when a loop is interrupted ("loop_broken").
const BREAKPOINT_GAIN: Record<PatternCategory, DimMap> = {
  fear:       { fear_reactivity: -0.20, emotional_stability: +0.15, inner_clarity: +0.10 },
  pride:      { ego_defensiveness: -0.20, self_honesty: +0.20, relational_health: +0.10 },
  shame:      { self_alignment: +0.20, resilience: +0.15, emotional_stability: +0.10 },
  desire:     { resilience: +0.12, self_alignment: +0.10 },
  relational: { relational_health: +0.20, self_alignment: +0.10 },
  confusion:  { inner_clarity: +0.20, self_honesty: +0.12, emotional_stability: +0.10 },
  growth:     { resilience: +0.10, self_alignment: +0.10, inner_clarity: +0.08 },
};

const CATEGORY_TO_LOOP: Partial<Record<PatternCategory, Loop>> = {
  fear: "control_loop", pride: "comparison_loop", shame: "avoidance_loop",
  desire: "impulse_loop", growth: "clarity_loop",
};

export interface DimensionScore {
  dimension: Dimension; score: number; delta: number;
  trend: "strengthening" | "weakening" | "stable"; confidence: number;
}
export type StateVector = Record<Dimension, number>;

export interface HistoryRow {
  pattern_categories?: PatternCategory[];
  deltas?: DimMap;                 // per-dimension delta recorded that session
  emotional_stability_delta?: number;
}

export interface FormationSnapshot {
  stateVector: StateVector;
  dimensions: Record<Dimension, DimensionScore>;
  dominantDimension: Dimension;
  trajectory: Trajectory;
  dominantLoop: Loop;
  formationArc: "breaking_through" | "deepening_loops" | "stabilizing" | "unknown";
  driftDetected: boolean;
  alignmentTrend: "improving" | "declining" | "stable";
  narrative: string;
}

export interface FormationInput {
  categories: PatternCategory[];
  loopBroken?: boolean;
  emotionalIntensity?: number;   // 1..10, 5 = baseline
  reflectionActive?: boolean;
  history?: HistoryRow[];        // most-recent-first
}

const clamp = (v: number) => Math.max(SCORE_MIN, Math.min(SCORE_MAX, v));
const round = (v: number, n = 3) => Number(v.toFixed(n));
const variance = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
};

function weightImpact(impact: number, intensity: number, reflectionActive: boolean): number {
  let mult = intensity / 5.0;
  if (impact < 0 && reflectionActive) mult *= 0.6; // reflection dampens negative reinforcement
  return impact * mult;
}

// Recency-weighted aggregation of historical deltas → base scores.
function aggregateHistory(history: HistoryRow[]): StateVector {
  const agg: DimMap = {};
  history.forEach((row, i) => {
    const w = RECENCY_DECAY ** i;
    for (const dim of DIMENSIONS) {
      const d = row.deltas?.[dim] ?? 0;
      agg[dim] = (agg[dim] ?? 0) + d * w;
    }
  });
  const out = {} as StateVector;
  for (const dim of DIMENSIONS) out[dim] = clamp(BASELINE + (agg[dim] ?? 0));
  return out;
}

function applyDeltas(input: Required<FormationInput>): Record<Dimension, DimensionScore> {
  const { categories, loopBroken, emotionalIntensity, reflectionActive, history } = input;
  const base = history.length ? aggregateHistory(history) : Object.fromEntries(DIMENSIONS.map((d) => [d, BASELINE])) as StateVector;
  const raw: Record<Dimension, number> = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Record<Dimension, number>;
  const intensityMult = emotionalIntensity / 5.0;

  for (const cat of categories) {
    const impacts = PATTERN_IMPACT[cat] ?? {};
    for (const [dim, impact] of Object.entries(impacts))
      raw[dim as Dimension] += weightImpact(impact, emotionalIntensity, reflectionActive);
  }
  if (loopBroken) {
    for (const cat of categories) {
      const gains = BREAKPOINT_GAIN[cat] ?? {};
      for (const [dim, gain] of Object.entries(gains)) raw[dim as Dimension] += gain * intensityMult;
    }
  }

  const confidence = Math.min(0.9, 0.25 + history.length * 0.025);
  const out = {} as Record<Dimension, DimensionScore>;
  for (const dim of DIMENSIONS) {
    const delta = raw[dim];
    const score = clamp(base[dim] + delta);
    const trend = delta > 0.02 ? "strengthening" : delta < -0.02 ? "weakening" : "stable";
    out[dim] = { dimension: dim, score: round(score), delta: round(delta), trend, confidence: round(confidence, 2) };
  }
  return out;
}

function layerTrajectory(s: Record<Dimension, DimensionScore>, history: HistoryRow[]): Trajectory {
  const d = (k: Dimension) => s[k].delta;
  if (history.length >= 6) {
    const vals = history.slice(0, 6).map((r) => r.emotional_stability_delta ?? 0);
    if (variance(vals) > 0.02) return "cyclical";
  }
  if (d("inner_clarity") > 0.05 && d("self_alignment") > 0.05) return "improving_clarity";
  if (d("emotional_stability") < -0.08 && d("fear_reactivity") > 0.08) return "increasing_volatility";
  if (d("resilience") > 0.05 && d("fear_reactivity") < -0.03) return "stabilizing";
  if (d("fear_reactivity") > 0.1 || d("emotional_stability") < -0.12) return "fragmenting";
  return "unknown";
}

function layerDrift(s: Record<Dimension, DimensionScore>): boolean {
  const drifting = DIMENSIONS.filter((dim) => Math.abs(s[dim].score - BASELINE) > 0.12);
  return drifting.length >= 2;
}

function layerLoop(categories: PatternCategory[], s: Record<Dimension, DimensionScore>, history: HistoryRow[]): Loop {
  const freq: Record<string, number> = {};
  for (const row of history) for (const c of row.pattern_categories ?? []) freq[c] = (freq[c] ?? 0) + 1;
  for (const c of categories) freq[c] = (freq[c] ?? 0) + 3; // current session ×3
  if (Object.keys(freq).length === 0) {
    if (s.fear_reactivity.score > 0.6) return "control_loop";
    if (s.ego_defensiveness.score > 0.6) return "comparison_loop";
    if (s.self_alignment.score > 0.65) return "clarity_loop";
    return "unknown";
  }
  const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0] as PatternCategory;
  return CATEGORY_TO_LOOP[dominant] ?? "unknown";
}

function layerAlignment(s: Record<Dimension, DimensionScore>): "improving" | "declining" | "stable" {
  const sig = s.self_alignment.delta + s.self_honesty.delta + s.inner_clarity.delta + s.emotional_stability.delta;
  if (sig > 0.08) return "improving";
  if (sig < -0.08) return "declining";
  return "stable";
}

function classifyArc(s: Record<Dimension, DimensionScore>, history: HistoryRow[]): FormationSnapshot["formationArc"] {
  const reactive: Dimension[] = ["fear_reactivity", "ego_defensiveness"];
  const healthyPos = DIMENSIONS.filter((d) => s[d].delta > 0.04 && !reactive.includes(d)).length;
  const fearRising = s.fear_reactivity.delta > 0.06, prideRising = s.ego_defensiveness.delta > 0.06;
  if (healthyPos >= 3) return "breaking_through";
  if (fearRising || prideRising) return "deepening_loops";
  if (history.length > 8) {
    const avg = DIMENSIONS.filter((d) => !reactive.includes(d)).reduce((a, d) => a + s[d].score, 0) / (DIMENSIONS.length - 2);
    if (avg > 0.58) return "stabilizing";
  }
  return "unknown";
}

const TRAJECTORY_PHRASE: Record<Trajectory, string> = {
  stabilizing: "Trajectory may be stabilizing — clarity and emotional regulation appear to be gaining ground.",
  fragmenting: "Trajectory may be fragmenting — reactive patterns appear to be intensifying. A structural observation, not a permanent condition.",
  improving_clarity: "A movement toward greater self-alignment and inner clarity may be underway.",
  increasing_volatility: "Emotional volatility may be increasing — a possible intervention window.",
  cyclical: "A cyclical pattern may be active — structural intervention tends to beat willpower here.",
  unknown: "Trajectory is not yet clearly directional. More sessions will reveal the pattern.",
};

/** Run the full 5-layer Formation analysis for one session. */
export function analyzeFormation(raw: FormationInput): FormationSnapshot {
  const input: Required<FormationInput> = {
    categories: raw.categories,
    loopBroken: raw.loopBroken ?? false,
    emotionalIntensity: raw.emotionalIntensity ?? 5,
    reflectionActive: raw.reflectionActive ?? false,
    history: raw.history ?? [],
  };
  const dimensions = applyDeltas(input);
  const stateVector = Object.fromEntries(DIMENSIONS.map((d) => [d, dimensions[d].score])) as StateVector;
  const trajectory = layerTrajectory(dimensions, input.history);
  const dominantLoop = layerLoop(input.categories, dimensions, input.history);
  const driftDetected = layerDrift(dimensions);
  const alignmentTrend = layerAlignment(dimensions);
  const formationArc = classifyArc(dimensions, input.history);
  const dominantDimension = DIMENSIONS.reduce((a, b) => (Math.abs(dimensions[b].delta) > Math.abs(dimensions[a].delta) ? b : a));

  let narrative = TRAJECTORY_PHRASE[trajectory];
  if (dominantLoop !== "unknown") narrative += ` Dominant behavioral loop: '${dominantLoop}'.`;
  if (driftDetected) narrative += " A slow long-term drift may be occurring across several dimensions.";
  if (input.history.length === 0) narrative += " This is the beginning of the formation record.";

  return { stateVector, dimensions, dominantDimension, trajectory, dominantLoop, formationArc, driftDetected, alignmentTrend, narrative };
}
