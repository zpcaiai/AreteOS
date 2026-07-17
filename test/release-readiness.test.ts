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
  AI_RUNTIME_VERIFIED_AT: new Date().toISOString(),
  LEGAL_ENTITY_NAME: "Example Ltd",
  LEGAL_ENTITY_ADDRESS: "1 Example Road",
  SUPPORT_EMAIL: "support@example.com",
  PRIVACY_EMAIL: "privacy@example.com",
  GOVERNING_LAW: "Example jurisdiction",
  DISPUTE_RESOLUTION: "Example courts",
  REFUND_POLICY: "No payments in pilot",
  SUBPROCESSORS: "None",
  DATA_REGIONS: "Test region",
  TERMS_VERSION: "2026-07-17",
  PRIVACY_VERSION: "2026-07-17",
  DATA_RETENTION_POLICY_VERSION: "2026-07-17",
  ANALYTICS_RETENTION_DAYS: "180",
  SECURITY_AUDIT_RETENTION_DAYS: "2555",
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
    const report = releaseReadiness({ ...base(), LEGAL_ENTITY_NAME: "" }, "paid");
    expect(report.ready).toBe(false);
    expect(report.failed).toContain("legal-documents");
    expect(report.failed).toContain("payment-provider");
    expect(report.failed).toContain("restore-drill");
    expect(report.failed).toContain("ai-evaluation");
  });

  it("fails every customer profile while legal versions are still drafts", () => {
    const report = releaseReadiness({ ...base(), TERMS_VERSION: "2026-07-17-draft" }, "pilot");
    expect(report.failed).toContain("legal-version");
    expect(runtimeReadiness({ ...base(), TERMS_VERSION: "draft" }).ready).toBe(false);
  });

  it("rejects malformed retention windows", () => {
    const report = releaseReadiness({ ...base(), ANALYTICS_RETENTION_DAYS: "forever" }, "pilot");
    expect(report.failed).toContain("retention-policy");
  });

  it("accepts Vercel AI Gateway OIDC without a long-lived provider key", () => {
    const env = { ...base(), AI_PROVIDER: "gateway", OPENAI_API_KEY: "", VERCEL: "1" };
    const report = releaseReadiness(env, "pilot");
    expect(report.ready).toBe(true);
    expect(report.checks.find((check) => check.id === "ai-credentials")?.status).toBe("pass");
  });

  it("fails runtime readiness when AI is configured but has not completed a real request", () => {
    const env = { ...base(), AI_RUNTIME_VERIFIED_AT: "" };
    expect(runtimeReadiness(env).failed).toContain("ai-runtime");
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
