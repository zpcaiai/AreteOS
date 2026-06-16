import { describe, expect, it } from "vitest";
import { PRESCRIPTION_TEMPLATES, prescriptionFor } from "../src/lib/prescription-templates";

describe("prescription templates", () => {
  it("has one well-formed template per bottleneck (16)", () => {
    const t = Object.values(PRESCRIPTION_TEMPLATES);
    expect(t).toHaveLength(16);
    expect(t.every((x) => x.title && x.objective && x.sevenDay.length > 0 && x.thirtyDay.length > 0 && x.linkedEngines.length > 0)).toBe(true);
  });
  it("looks up by bottleneck and returns null for unknown", () => {
    expect(prescriptionFor("asset")?.bottleneck).toBe("asset");
    expect(prescriptionFor("nope")).toBeNull();
  });
});
