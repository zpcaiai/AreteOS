import { describe, expect, it } from "vitest";
import { parseGitLog, parseIcs } from "../src/lib/evidence-connectors";

describe("parseGitLog", () => {
  it("tallies commits per day and normalizes against a target", () => {
    const raw = ["2026-06-10 fix", "2026-06-10 add", "2026-06-10 refactor", "2026-06-11 docs", "not a date line"].join("\n");
    const g = parseGitLog(raw, { target: 3 });
    expect(g).toHaveLength(2);
    expect(g[0].value).toBe(1);
    expect(g[1].value).toBeCloseTo(1 / 3, 9);
    expect(g[0].kind).toBe("habits");
    expect(g[0].source).toBe("git");
  });
});

describe("parseIcs", () => {
  const ics = [
    "BEGIN:VEVENT", "DTSTART:20260610T090000Z", "SUMMARY:Weekly Review", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20260611", "SUMMARY:Deep Work block", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART:20260612T120000Z", "SUMMARY:Lunch with Sam", "END:VEVENT",
  ].join("\n");
  it("maps event titles to domains and skips non-matching events", () => {
    const e = parseIcs(ics);
    expect(e).toHaveLength(2);
    expect(e.map((s) => s.kind).sort()).toEqual(["habits", "reflection"]);
    expect(e.every((s) => s.source === "calendar")).toBe(true);
  });
});
