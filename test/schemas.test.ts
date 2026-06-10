import { describe, expect, it } from "vitest";
import { NavalGoalSchema, CoachMessageSchema, firstIssue } from "../src/lib/schemas";

describe("shared schemas", () => {
  it("accepts a valid naval goal", () => {
    expect(firstIssue(NavalGoalSchema, { statement: "Own assets that buy back my time.", horizon: "FIVE_YEARS" })).toBeNull();
  });

  it("rejects a too-short goal with a human message", () => {
    const issue = firstIssue(NavalGoalSchema, { statement: "rich" });
    expect(issue).toMatch(/at least/i);
  });

  it("rejects an over-long coach message", () => {
    const issue = firstIssue(CoachMessageSchema, { message: "x".repeat(4001) });
    expect(issue).toMatch(/4000/);
  });

  it("trims whitespace-only messages to invalid", () => {
    expect(firstIssue(CoachMessageSchema, { message: "   " })).not.toBeNull();
  });
});
