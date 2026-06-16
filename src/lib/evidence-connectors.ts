// Evidence connectors. Real, offline parsers that turn data the user already has
// — a `git log` dump or an exported `.ics` calendar — into normalized evidence
// signals. This is the ingestion layer a future OAuth integration would feed;
// pure + testable, no network. Map: behavior → enacted level per domain.

import { clamp01 } from "./scoring";
import type { EvidenceSignal } from "./evidence-math";

export interface ConnectorOptions {
  kind?: string;
  /** commits/day that counts as "full" (value 1.0). */
  target?: number;
}

/** Parse `git log --date=short --pretty=%ad` (date-first lines) into daily-cadence signals. */
export function parseGitLog(raw: string, opts: ConnectorOptions = {}): EvidenceSignal[] {
  const kind = opts.kind ?? "habits";
  const target = Math.max(1, opts.target ?? 3);
  const perDay = new Map<string, number>();
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*(\d{4}-\d{2}-\d{2})/);
    if (!m) continue;
    perDay.set(m[1], (perDay.get(m[1]) ?? 0) + 1);
  }
  const out: EvidenceSignal[] = [];
  for (const [day, count] of perDay) {
    out.push({ source: "git", kind, value: clamp01(count / target), at: Date.parse(`${day}T12:00:00Z`) });
  }
  return out.sort((a, b) => a.at - b.at);
}

export interface IcsOptions {
  value?: number;
  keywords?: [RegExp, string][];
}

const DEFAULT_KEYWORDS: [RegExp, string][] = [
  [/review|retro|reflect/i, "reflection"],
  [/deep ?work|focus block|focus time/i, "habits"],
  [/study|learn|read|practice|course/i, "mastery"],
  [/decision|decide/i, "decisions"],
  [/plan|strategy|mission/i, "mission"],
];

/** Parse exported iCalendar (.ics) VEVENTs whose titles match a domain keyword. */
export function parseIcs(raw: string, opts: IcsOptions = {}): EvidenceSignal[] {
  const value = clamp01(opts.value ?? 0.8);
  const keywords = opts.keywords ?? DEFAULT_KEYWORDS;
  const blocks = raw.split(/BEGIN:VEVENT/i).slice(1);
  const out: EvidenceSignal[] = [];
  for (const b of blocks) {
    const summary = (b.match(/\nSUMMARY[^:\n]*:([^\n\r]+)/i)?.[1] ?? "").trim();
    const dt = b.match(/DTSTART[^:\n]*:(\d{8})/i)?.[1];
    if (!summary || !dt) continue;
    let kind = "";
    for (const [re, k] of keywords) if (re.test(summary)) { kind = k; break; }
    if (!kind) continue;
    const at = Date.UTC(Number(dt.slice(0, 4)), Number(dt.slice(4, 6)) - 1, Number(dt.slice(6, 8)), 12);
    out.push({ source: "calendar", kind, value, at });
  }
  return out.sort((a, b) => a.at - b.at);
}
