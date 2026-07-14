import { describe, expect, it } from "vitest";
import {
  CLINICAL_MODULES, clinicalSafetyGate, expertReviewStatus, type ClinicalModule,
} from "../src/lib/clinical/review-registry";
import { crisisResourcesFor, UNIVERSAL_CRISIS_GUIDANCE } from "../src/lib/healing/crisis-resources";

describe("clinical safety gate", () => {
  it("passes for the current registry — every clinical module has the safety essentials", () => {
    const r = clinicalSafetyGate();
    expect(r.ok).toBe(true);
    expect(r.checked).toBeGreaterThan(0);
    expect(r.violations).toEqual([]);
  });

  it("flags a clinical module that is missing crisis resources", () => {
    const bad: ClinicalModule[] = [
      { key: "x", route: "/x", name: { zh: "x", en: "x" }, clinical: true,
        notDiagnosisBoundary: true, crisisResources: false, safetyTriage: true, expertReview: "pending" },
    ];
    const r = clinicalSafetyGate(bad);
    expect(r.ok).toBe(false);
    expect(r.violations[0].missing).toContain("crisisResources");
  });

  it("ignores non-clinical modules in the blocking gate", () => {
    const r = clinicalSafetyGate(CLINICAL_MODULES.filter((m) => !m.clinical));
    expect(r.checked).toBe(0);
    expect(r.ok).toBe(true);
  });
});

describe("expert review tracking", () => {
  it("reports pending clinician sign-off honestly", () => {
    const s = expertReviewStatus();
    expect(s.clinicalModules).toBeGreaterThan(0);
    expect(s.coverage).toBeGreaterThanOrEqual(0);
    expect(s.coverage).toBeLessThanOrEqual(1);
    expect(s.reviewed + s.pending).toBe(s.clinicalModules);
  });

  it("registry keys are unique and clinical modules have routes", () => {
    const keys = CLINICAL_MODULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const m of CLINICAL_MODULES) if (m.clinical) expect(m.route.startsWith("/")).toBe(true);
  });
});

describe("crisis resources (region + fallback)", () => {
  it("always returns options and includes an international fallback", () => {
    for (const loc of ["zh-CN", "en-US", "fr-FR"]) {
      const rs = crisisResourcesFor(loc);
      expect(rs.length).toBeGreaterThan(0);
      expect(rs.some((r) => r.region === "INTL")).toBe(true);
    }
  });

  it("has a non-promissory universal guidance line in both languages", () => {
    expect(UNIVERSAL_CRISIS_GUIDANCE.zh.length).toBeGreaterThan(0);
    expect(UNIVERSAL_CRISIS_GUIDANCE.en.length).toBeGreaterThan(0);
  });
});
