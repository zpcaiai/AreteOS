import { describe, expect, it } from "vitest";
import { hasFeature, TEAM_PLAN, TIER_RANK } from "../src/lib/membership/plans";

describe("team seat entitlement", () => {
  it("a team grants PRO, so members get every PRO feature", () => {
    expect(TEAM_PLAN.grantsTier).toBe("PRO");
    for (const f of ["cross_engine", "digital_twin", "knowledge_graph", "sfm", "leadership"]) {
      expect(hasFeature(TEAM_PLAN.grantsTier, f)).toBe(true);
    }
  });

  it("PRO outranks FREE/PLUS so the team upgrade is never a downgrade", () => {
    expect(TIER_RANK[TEAM_PLAN.grantsTier]).toBeGreaterThan(TIER_RANK.PLUS);
    expect(TIER_RANK[TEAM_PLAN.grantsTier]).toBeGreaterThan(TIER_RANK.FREE);
  });

  it("is priced per seat with a sane minimum", () => {
    expect(TEAM_PLAN.minSeats).toBeGreaterThanOrEqual(1);
    expect(TEAM_PLAN.pricePerSeat.MONTHLY).toBeGreaterThan(0);
    expect(TEAM_PLAN.pricePerSeat.ANNUAL).toBeGreaterThan(0);
  });
});
