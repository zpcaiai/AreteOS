import { describe, expect, it } from "vitest";
import { FOUNDRY_FEATURES, STARTER_PACKS, WORKSPACE_TEMPLATES } from "../src/lib/project-foundry-catalog";
import { buildProjectBlueprint, expandFeatureDependencies } from "../src/lib/project-foundry";

describe("Project Foundry", () => {
  it("has unique module identifiers and resolvable dependencies", () => {
    const ids = new Set(FOUNDRY_FEATURES.map((feature) => feature.id));
    expect(ids.size).toBe(FOUNDRY_FEATURES.length);
    for (const feature of FOUNDRY_FEATURES) for (const dependency of feature.dependencies ?? []) expect(ids.has(dependency)).toBe(true);
    for (const pack of STARTER_PACKS) for (const id of pack.featureIds) expect(ids.has(id)).toBe(true);
    for (const template of WORKSPACE_TEMPLATES) for (const id of template.featureIds) expect(ids.has(id)).toBe(true);
  });

  it("offers complete, ready-to-edit workspaces across the capability catalog", () => {
    expect(WORKSPACE_TEMPLATES.length).toBeGreaterThanOrEqual(10);
    const covered = new Set(WORKSPACE_TEMPLATES.flatMap((template) => template.featureIds));
    for (const feature of FOUNDRY_FEATURES) expect(covered.has(feature.id)).toBe(true);
    for (const template of WORKSPACE_TEMPLATES) {
      expect(template.title.length).toBeGreaterThan(1);
      expect(template.problem.length).toBeGreaterThanOrEqual(10);
      expect(template.audience.length).toBeGreaterThan(1);
      expect(template.constraints.length).toBeGreaterThan(1);
      expect(template.featureIds.length).toBeGreaterThan(0);
    }
  });

  it("includes the core enterprise business templates", () => {
    const ids = new Set(WORKSPACE_TEMPLATES.map((template) => template.id));
    for (const id of [
      "b2b-mvp-validation",
      "ai-product-copilot",
      "consulting-client-delivery",
      "ecommerce-dtc",
      "manufacturing-operations",
      "agency-client-growth",
      "education-institution",
      "marketplace-platform",
      "property-space-service",
      "startup-operating-system",
    ]) expect(ids.has(id)).toBe(true);
  });

  it("includes templates for home services, company scale, and public institutions", () => {
    const ids = new Set(WORKSPACE_TEMPLATES.map((template) => template.id));
    for (const id of [
      "home-services-operations",
      "small-business-owner",
      "small-business-digitalization",
      "ai-startup-pmf",
      "ai-startup-evals-governance",
      "large-enterprise-strategy-execution",
      "large-enterprise-shared-services",
      "state-owned-enterprise-operations",
      "public-institution-service",
      "public-institution-research-program",
    ]) expect(ids.has(id)).toBe(true);
  });

  it("recursively adds prerequisites to a selected capability", () => {
    const expanded = expandFeatureDependencies(["ai-coach"]);
    expect(expanded.selectedIds).toEqual(expect.arrayContaining(["ai-coach", "onboarding-loop", "problem-framing", "privacy-controls", "auth-roles"]));
    expect(expanded.addedIds).toEqual(expect.arrayContaining(["onboarding-loop", "privacy-controls"]));
  });

  it("creates a constrained blueprint and defers overscope", () => {
    const blueprint = buildProjectBlueprint({
      title: "Founder research copilot",
      problem: "Early founders struggle to turn customer conversations into tested product decisions and next experiments.",
      audience: "B2B SaaS founders with fewer than ten team members",
      projectType: "founder",
      selectedIds: STARTER_PACKS.find((pack) => pack.id === "founder")!.featureIds,
      constraints: "Two people, six weeks",
    });
    expect(blueprint.feasibility.score).toBeGreaterThanOrEqual(80);
    expect(blueprint.phases.length).toBeGreaterThan(1);
    expect(blueprint.mvp.featureIds.length).toBeLessThanOrEqual(8);
    expect(blueprint.selectedFeatures.some((feature) => feature.id === "problem-framing")).toBe(true);
  });
});
