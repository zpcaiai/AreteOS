// Deep Work (flagship) — pure session + dashboard math. Deep work = focused
// attention × cognitive difficulty × low distraction × valuable output. No I/O
// imports; unit-testable. The UI's live timer/telemetry feed these functions.

import { clamp01, geoMean01, mean01, ratio01, round1 } from "./skills-scoring";

export interface SessionTelemetry {
  durationMin: number;
  distractions: number;
  difficulty: number; // 0..1 cognitive difficulty
  outputQuality: number; // 0..1
  at: number; // epoch ms (session end)
}

/** Distractions per hour, normalized to 0..1 (10/hr ≈ fully distracted). */
export function distractionRate(durationMin: number, distractions: number): number {
  const hours = Math.max(1 / 6, durationMin / 60);
  return clamp01(distractions / hours / 10);
}

/** Single-session focus depth 0..1: difficulty-weighted attention, distraction-penalized. */
export function sessionFocusDepth(t: SessionTelemetry): number {
  const base = 0.5 + 0.5 * clamp01(t.difficulty);
  return clamp01(base * (1 - 0.6 * distractionRate(t.durationMin, t.distractions)));
}

/** Single-session score 0..100. */
export function sessionScore(t: SessionTelemetry): number {
  return round1(geoMean01([sessionFocusDepth(t), clamp01(0.4 + 0.6 * t.difficulty), clamp01(t.outputQuality)]) * 100);
}

export interface DeepWorkDashboard {
  totalSessions: number;
  totalMinutes: number;
  consistency: number; // 0..1 days-with-a-session / window
  focusDepth: number;
  distractionControl: number;
  cognitiveDifficulty: number;
  outputValue: number;
  global: number; // 0..100
  heatmap: { date: string; minutes: number; sessions: number; score: number }[];
  weekly: WeekStat[];
}

export interface WeekStat { weekStart: string; minutes: number; sessions: number; avgScore: number }

const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function deepWorkDashboard(sessions: SessionTelemetry[], windowDays = 28, now = Date.now()): DeepWorkDashboard {
  const totalMinutes = sessions.reduce((s, x) => s + x.durationMin, 0);
  const focusDepth = sessions.length ? mean01(sessions.map(sessionFocusDepth)) : 0;
  const distraction = sessions.length ? mean01(sessions.map((s) => distractionRate(s.durationMin, s.distractions))) : 0;
  const distractionControl = clamp01(1 - distraction);
  const cognitiveDifficulty = sessions.length ? mean01(sessions.map((s) => s.difficulty)) : 0;
  const outputValue = sessions.length ? mean01(sessions.map((s) => s.outputQuality)) : 0;

  // build per-day heatmap over the window
  const byDay = new Map<string, { minutes: number; sessions: number; scoreSum: number }>();
  for (const s of sessions) {
    const k = dayKey(s.at);
    const cur = byDay.get(k) ?? { minutes: 0, sessions: 0, scoreSum: 0 };
    cur.minutes += s.durationMin;
    cur.sessions += 1;
    cur.scoreSum += sessionScore(s);
    byDay.set(k, cur);
  }
  const heatmap: DeepWorkDashboard["heatmap"] = [];
  let activeDays = 0;
  for (let i = windowDays - 1; i >= 0; i -= 1) {
    const k = dayKey(now - i * 86_400_000);
    const d = byDay.get(k);
    if (d) activeDays += 1;
    heatmap.push({ date: k, minutes: d?.minutes ?? 0, sessions: d?.sessions ?? 0, score: d ? Math.round(d.scoreSum / d.sessions) : 0 });
  }
  const consistency = clamp01(activeDays / windowDays);
  const global = round1(ratio01([consistency, focusDepth, cognitiveDifficulty, outputValue], distraction) * 100);

  return { totalSessions: sessions.length, totalMinutes, consistency, focusDepth, distractionControl, cognitiveDifficulty, outputValue, global, heatmap, weekly: weeklySummary(sessions, 4, now) };
}


/** Last N 7-day windows: minutes, sessions, average session score. */
export function weeklySummary(sessions: SessionTelemetry[], weeks = 4, now = Date.now()): WeekStat[] {
  const out: WeekStat[] = [];
  for (let w = weeks - 1; w >= 0; w -= 1) {
    const end = now - w * 7 * 86_400_000;
    const start = end - 7 * 86_400_000;
    const inWeek = sessions.filter((s) => s.at > start && s.at <= end);
    const minutes = inWeek.reduce((acc, s) => acc + s.durationMin, 0);
    const avgScore = inWeek.length ? Math.round(inWeek.reduce((acc, s) => acc + sessionScore(s), 0) / inWeek.length) : 0;
    out.push({ weekStart: new Date(start + 86_400_000).toISOString().slice(0, 10), minutes, sessions: inWeek.length, avgScore });
  }
  return out;
}
