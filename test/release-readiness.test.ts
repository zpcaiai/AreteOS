import { describe, expect, it } from "vitest";
import { releaseReadiness, runtimeReadiness } from "../src/lib/release/readiness";

const base = (): NodeJS.ProcessEnv => ({
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://example",
  AUTH_SECRET: "x".repeat(40),
  NEXT_PUBLIC_SITE_URL: "https://example.com",
  ADMIN_EMAILS: "admin@example.com",
  CRON_SECRET: "cron-secret",
  AI_PROVIDER: "openai",
  OPENAI_API_KEY: "test",
  REGISTRATION_MODE: "closed",
  OBSERVABILITY_PROVIDER: "vercel",
  RELEASE_PROFILE: "pilot",
  PAYMENTS_ENABLED: "false",
  CLINICAL_FEATURE_ENABLED: "false",
  CHILD_FEATURE_ENABLED: "false",
});

describe("release readiness", () => {
  it("allows a closed-registration non-sensitive pilot when the runtime is configured", () => {
    const report = releaseReadiness(base(), "pilot");
    expect(report.ready).toBe(true);
    expect(report.checks.find((check) => check.id === "payment-provider")?.status).toBe("disabled");
    expect(report.checks.find((check) => check.id === "ai-credentials")?.status).toBe("pass");
    expect(runtimeReadiness(base()).ready).toBe(true);
  });

  it("fails a paid release without real legal, payment, and operational evidence", () => {
    const report = releaseReadiness(base(), "paid");
    expect(report.ready).toBe(false);
    expect(report.failed).toContain("legal-documents");
    expect(report.failed).toContain("payment-provider");
    expect(report.failed).toContain("restore-drill");
    expect(report.failed).toContain("ai-evaluation");
  });

  it("accepts Vercel AI Gateway OIDC without a long-lived provider key", () => {
    const env = { ...base(), AI_PROVIDER: "gateway", OPENAI_API_KEY: "", VERCEL: "1" };
    const report = releaseReadiness(env, "pilot");
    expect(report.ready).toBe(true);
    expect(report.checks.find((check) => check.id === "ai-credentials")?.status).toBe("pass");
  });

  it("fails clinical promotion while expert reviews are pending", () => {
    const env = { ...base(), CLINICAL_FEATURE_ENABLED: "true", CRISIS_RESOURCES_VERIFIED_AT: new Date().toISOString() };
    const report = releaseReadiness(env, "clinical");
    expect(report.failed).toContain("clinical-signoff");
  });

  it("requires guardian enforcement and current safeguarding reviews for family release", () => {
    const report = releaseReadiness({ ...base(), CHILD_FEATURE_ENABLED: "true" }, "family");
    expect(report.failed).toContain("guardian-consent");
    expect(report.failed).toContain("child-safeguarding");
    expect(report.failed).toContain("child-privacy");
  });
});
