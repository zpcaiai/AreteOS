/* Decision-source scoring — deterministic TS port of
   emotion-sphere/backend/discernment_engine.py (secularized).
   Given an emotional state + motive profile, scores which SOURCE is most
   likely driving a decision. No LLM. Pairs with the DecisionMotiveGuide agent. */

export type DecisionSource =
  | "values" | "fear" | "pride" | "depletion"
  | "social_pressure" | "impulse" | "conscience" | "mixed" | "uncertain";

export type Confidence = "high" | "medium" | "low";

export interface EmotionalState {
  emotionalStability: number; // 0..10
  anxietyLevel: number;       // 0..10
  stressLevel: number;        // 0..10
  fatigueLevel: number;       // 0..10
  innerDepletion: number;     // 0..10  (orig: spiritual_dryness)
}
export interface MotiveProfile {
  care: number; fear: number; pride: number; desire: number; ambition: number; duty: number; // each 0..1
}

export interface DiscernmentResult {
  scores: Record<DecisionSource, number>;
  primary: DecisionSource;
  secondary: DecisionSource | null;
  confidence: Confidence;
  confidenceScore: number;
}

const cap = (v: number) => Math.min(1, v);

export function scoreDecisionSources(state: EmotionalState, m: MotiveProfile): Record<DecisionSource, number> {
  const s: Partial<Record<DecisionSource, number>> = {};
  s.values = cap(m.care * 0.8 + (state.emotionalStability / 10) * 0.4 + (1 - state.anxietyLevel / 10) * 0.3);
  s.fear = cap(m.fear * 0.9 + (state.anxietyLevel / 10) * 0.8 + (state.stressLevel / 10) * 0.6);
  s.pride = cap(m.pride * 0.9 + (1 - state.emotionalStability / 10) * 0.4);
  s.depletion = cap(m.fear * 0.5 + (state.innerDepletion / 10) * 0.7 + (1 - state.emotionalStability / 10) * 0.6);
  s.social_pressure = cap(m.desire * 0.7 + m.ambition * 0.6);
  s.impulse = cap(m.desire * 0.8 + (state.fatigueLevel / 10) * 0.4);
  s.conscience = cap(m.duty * 0.7 + (state.emotionalStability / 10) * 0.4);
  return s as Record<DecisionSource, number>;
}

function mapConfidence(score: number): Confidence {
  return score >= 0.7 ? "high" : score >= 0.5 ? "medium" : "low";
}

export function discernDecision(state: EmotionalState, motive: MotiveProfile): DiscernmentResult {
  const scores = scoreDecisionSources(state, motive);
  const sorted = (Object.entries(scores) as [DecisionSource, number][]).sort((a, b) => b[1] - a[1]);
  const [primary, primaryScore] = sorted[0];
  let secondary: DecisionSource | null = null;
  if (sorted.length >= 2 && primaryScore - sorted[1][1] < 0.15) secondary = sorted[1][0];

  if (primaryScore < 0.3) return { scores, primary: "uncertain", secondary: null, confidence: "low", confidenceScore: round(primaryScore) };
  if (primaryScore < 0.5 && secondary && sorted[1][1] > 0.35)
    return { scores, primary: "mixed", secondary: null, confidence: "low", confidenceScore: round(primaryScore) };

  const stability = state.emotionalStability / 10;
  const adjusted = Math.min(1, primaryScore * (0.7 + 0.3 * stability));
  return { scores, primary, secondary, confidence: mapConfidence(adjusted), confidenceScore: round(adjusted) };
}

const round = (v: number) => Number(v.toFixed(3));
