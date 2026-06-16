// Growth-narrative signal extraction. Pure functions that turn the event log +
// score snapshots into the STRUCTURED facts a narrator can render as the "story
// of who you're becoming". No prose here — just defensible signals from data.

export interface ScorePoint {
  at: number; // epoch ms
  value: number; // 0..1 growth
}

export interface TrajectorySummary {
  points: number;
  start: number;
  end: number;
  change: number;
  peak: { at: number; value: number };
  trough: { at: number; value: number };
  momentum: "rising" | "falling" | "flat";
}

export interface TurningPoint {
  index: number;
  at: number;
  from: number;
  to: number;
  delta: number;
  direction: "up" | "down";
}

export interface ActivitySummary {
  total: number;
  byAggregate: Record<string, number>;
  topEngine: string;
}

export function summarizeTrajectory(points: ScorePoint[]): TrajectorySummary {
  if (points.length === 0) {
    const z = { at: 0, value: 0 };
    return { points: 0, start: 0, end: 0, change: 0, peak: z, trough: z, momentum: "flat" };
  }
  const start = points[0].value;
  const end = points[points.length - 1].value;
  let peak = points[0];
  let trough = points[0];
  for (const p of points) {
    if (p.value > peak.value) peak = p;
    if (p.value < trough.value) trough = p;
  }
  const w = Math.min(5, points.length);
  const slope = points[points.length - 1].value - points[points.length - w].value;
  const momentum = slope > 0.01 ? "rising" : slope < -0.01 ? "falling" : "flat";
  return { points: points.length, start, end, change: end - start, peak: { at: peak.at, value: peak.value }, trough: { at: trough.at, value: trough.value }, momentum };
}

export function detectTurningPoints(points: ScorePoint[], minDelta = 0.05): TurningPoint[] {
  const out: TurningPoint[] = [];
  for (let i = 1; i < points.length; i += 1) {
    const delta = points[i].value - points[i - 1].value;
    if (Math.abs(delta) >= minDelta) {
      out.push({ index: i, at: points[i].at, from: points[i - 1].value, to: points[i].value, delta, direction: delta >= 0 ? "up" : "down" });
    }
  }
  return out;
}

export function activitySummary(events: { aggregateType: string }[]): ActivitySummary {
  const byAggregate: Record<string, number> = {};
  for (const e of events) byAggregate[e.aggregateType] = (byAggregate[e.aggregateType] ?? 0) + 1;
  let topEngine = "";
  let max = -1;
  for (const [k, v] of Object.entries(byAggregate)) if (v > max) { max = v; topEngine = k; }
  return { total: events.length, byAggregate, topEngine };
}

export interface StageTransition {
  fromStage: string;
  toStage: string;
  at: number;
}

export interface NarrativeSignals {
  trajectory: TrajectorySummary;
  turningPoints: TurningPoint[];
  activity: ActivitySummary;
  transitions: StageTransition[];
}

export function assembleNarrativeSignals(input: {
  points: ScorePoint[];
  events: { aggregateType: string }[];
  transitions: StageTransition[];
  minDelta?: number;
}): NarrativeSignals {
  return {
    trajectory: summarizeTrajectory(input.points),
    turningPoints: detectTurningPoints(input.points, input.minDelta ?? 0.05),
    activity: activitySummary(input.events),
    transitions: input.transitions,
  };
}
