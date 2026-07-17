import { describe, expect, it } from "vitest";
import { retentionDays } from "../src/lib/maintenance";

describe("retention configuration", () => {
  it("accepts explicit bounded day windows", () => {
    expect(retentionDays("DAYS", 180, { DAYS: "30" })).toBe(30);
    expect(retentionDays("DAYS", 180, { DAYS: "0" })).toBe(0);
  });

  it("fails safely to the documented default", () => {
    expect(retentionDays("DAYS", 180, { DAYS: "not-a-number" })).toBe(180);
    expect(retentionDays("DAYS", 180, { DAYS: "99999" })).toBe(180);
    expect(retentionDays("DAYS", 180, { DAYS: "-1" })).toBe(180);
  });
});
