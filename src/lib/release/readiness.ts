import { expertReviewStatus } from "../clinical/review-registry";

export type ReleaseProfile = "pilot" | "paid" | "clinical" | "family" | "enterprise";
export type ReleaseCheckStatus = "pass" | "fail" | "disabled";

export interface ReleaseCheck {
  id: string;
  category: "runtime" | "security" | "legal" | "ai" | "payments" | "operations" | "clinical" | "family" | "enterprise";
  status: ReleaseCheckStatus;
  message: string;
  remediation?: string;
}

export interface ReleaseReadiness {
  profile: ReleaseProfile;
  ready: boolean;
  generatedAt: string;
  checks: ReleaseCheck[];
  failed: string[];
}

const truthy = (value: string | undefined) => value === "true" || value === "1";
const present = (name: string, env: NodeJS.ProcessEnv) => Boolean(env[name]?.trim());

function profileFrom(value: string | undefined): ReleaseProfile {
  return value === "paid" || value === "clinical" || value === "family" || value === "enterprise" ? value : "pilot";
}

function required(id: string, category: ReleaseCheck["category"], names: string[], env: NodeJS.ProcessEnv, message: string): ReleaseCheck {
  const missing = names.filter((name) => !present(name, env));
  return missing.length
    ? { id, category, status: "fail", message, remediation: `Configure: ${missing.join(", ")}` }
    : { id, category, status: "pass", message };
}

function attestation(
  id: string,
  category: ReleaseCheck["category"],
  envName: string,
  maxAgeDays: number,
  env: NodeJS.ProcessEnv,
  message: string,
): ReleaseCheck {
  const raw = env[envName];
  const timestamp = raw ? Date.parse(raw) : Number.NaN;
  const fresh = Number.isFinite(timestamp) && timestamp <= Date.now() && Date.now() - timestamp <= maxAgeDays * 86_400_000;
  return fresh
    ? { id, category, status: "pass", message }
    : { id, category, status: "fail", message, remediation: `${envName} must contain a valid ISO timestamp from the last ${maxAgeDays} days` };
}

function disabled(id: string, category: ReleaseCheck["category"], message: string): ReleaseCheck {
  return { id, category, status: "disabled", message };
}

/**
 * Commercial release gate. Human and external approvals remain fail-closed:
 * code cannot impersonate counsel, clinicians, payment providers, reviewers,
 * or a completed recovery exercise.
 */
export function releaseReadiness(env: NodeJS.ProcessEnv = process.env, requestedProfile?: ReleaseProfile): ReleaseReadiness {
  const profile = requestedProfile ?? profileFrom(env.RELEASE_PROFILE);
  const paid = profile !== "pilot";
  const clinical = profile === "clinical";
  const family = profile === "family";
  const enterprise = profile === "enterprise";
  const paymentsEnabled = truthy(env.PAYMENTS_ENABLED);
  const childEnabled = truthy(env.CHILD_FEATURE_ENABLED);
  const clinicalEnabled = truthy(env.CLINICAL_FEATURE_ENABLED);
  const registrationMode = env.REGISTRATION_MODE || "closed";
  const observability = env.OBSERVABILITY_PROVIDER || "vercel";

  const checks: ReleaseCheck[] = [
    required("runtime-core", "runtime", ["DATABASE_URL", "AUTH_SECRET", "NEXT_PUBLIC_SITE_URL", "ADMIN_EMAILS", "CRON_SECRET"], env, "Core runtime configuration is complete"),
    (env.AUTH_SECRET?.length ?? 0) >= 32
      ? { id: "auth-secret-strength", category: "security", status: "pass", message: "Authentication secret meets the minimum length" }
      : { id: "auth-secret-strength", category: "security", status: "fail", message: "Authentication secret is too short", remediation: "Set AUTH_SECRET to at least 32 random characters" },
    ["closed", "invite", "open"].includes(registrationMode)
      ? { id: "registration-mode", category: "security", status: "pass", message: `Registration mode is explicit (${registrationMode})` }
      : { id: "registration-mode", category: "security", status: "fail", message: "Registration mode is invalid", remediation: "Set REGISTRATION_MODE to closed, invite, or open" },
    env.AI_PROVIDER && env.AI_PROVIDER !== "mock"
      ? { id: "real-ai-provider", category: "ai", status: "pass", message: `A real AI provider is selected (${env.AI_PROVIDER})` }
      : { id: "real-ai-provider", category: "ai", status: "fail", message: "A real AI provider is required", remediation: "Configure AI_PROVIDER and its provider credentials" },
  ];
  if (env.AI_PROVIDER === "gateway") {
    checks.push(env.VERCEL === "1" || present("VERCEL_OIDC_TOKEN", env) || present("AI_GATEWAY_API_KEY", env)
      ? { id: "ai-credentials", category: "ai", status: "pass", message: "Vercel AI Gateway authentication is available" }
      : { id: "ai-credentials", category: "ai", status: "fail", message: "AI Gateway authentication is unavailable", remediation: "Deploy on Vercel with OIDC or set AI_GATEWAY_API_KEY" });
  } else {
    const aiCredential = env.AI_PROVIDER === "openai"
      ? ["OPENAI_API_KEY"]
      : env.AI_PROVIDER === "anthropic"
        ? ["ANTHROPIC_API_KEY"]
        : env.AI_PROVIDER === "ollama"
          ? ["OLLAMA_BASE_URL"]
          : ["AI_PROVIDER"];
    checks.push(required("ai-credentials", "ai", aiCredential, env, "AI provider credentials are configured"));
  }
  checks.push(attestation("ai-runtime", "ai", "AI_RUNTIME_VERIFIED_AT", 7, env, "A real AI request and blocking scenario suite passed recently"));

  checks.push(required(
    "legal-documents",
    "legal",
    ["LEGAL_ENTITY_NAME", "LEGAL_ENTITY_ADDRESS", "SUPPORT_EMAIL", "PRIVACY_EMAIL", "GOVERNING_LAW", "DISPUTE_RESOLUTION", "REFUND_POLICY", "SUBPROCESSORS", "DATA_REGIONS", "TERMS_VERSION", "PRIVACY_VERSION"],
    env,
    "Customer-facing legal documents contain the real operator and regional terms",
  ));
  const legalVersions = [env.TERMS_VERSION, env.PRIVACY_VERSION];
  checks.push(legalVersions.every((value) => Boolean(value?.trim()) && !value!.toLowerCase().includes("draft"))
    ? { id: "legal-version", category: "legal", status: "pass", message: "Published legal document versions are non-draft" }
    : { id: "legal-version", category: "legal", status: "fail", message: "Legal document versions are missing or still draft", remediation: "Publish counsel-approved TERMS_VERSION and PRIVACY_VERSION without a draft marker" });
  const retentionDays = [env.ANALYTICS_RETENTION_DAYS, env.SECURITY_AUDIT_RETENTION_DAYS].map(Number);
  checks.push(present("DATA_RETENTION_POLICY_VERSION", env) && retentionDays.every((days) => Number.isInteger(days) && days >= 1 && days <= 3650)
    ? { id: "retention-policy", category: "operations", status: "pass", message: "Data retention policy and deletion windows are explicit" }
    : { id: "retention-policy", category: "operations", status: "fail", message: "Data retention policy or deletion windows are invalid", remediation: "Set DATA_RETENTION_POLICY_VERSION and integer ANALYTICS_RETENTION_DAYS / SECURITY_AUDIT_RETENTION_DAYS between 1 and 3650" });

  if (registrationMode !== "closed" || truthy(env.AUTH_REQUIRE_EMAIL_VERIFICATION)) {
    checks.push(required("transactional-email", "runtime", ["RESEND_API_KEY", "AUTH_EMAIL_FROM"], env, "Transactional email is configured"));
  } else {
    checks.push(disabled("transactional-email", "runtime", "Transactional email is not required while registration is closed"));
  }

  if (observability === "sentry") {
    checks.push(required("observability", "operations", ["SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN"], env, "Sentry error monitoring is configured"));
  } else if (observability === "vercel") {
    checks.push({ id: "observability", category: "operations", status: "pass", message: "Vercel logs and platform observability are selected" });
  } else {
    checks.push({ id: "observability", category: "operations", status: "fail", message: "Observability provider is invalid", remediation: "Set OBSERVABILITY_PROVIDER to vercel or sentry" });
  }

  if (paid || paymentsEnabled) {
    const provider = env.PAYMENT_PROVIDER;
    const names = provider === "alipay"
      ? ["ALIPAY_APP_ID", "ALIPAY_PRIVATE_KEY", "ALIPAY_PUBLIC_KEY"]
      : provider === "wechat"
        ? ["WECHAT_PAY_APP_ID", "WECHAT_PAY_MCH_ID", "WECHAT_PAY_PRIVATE_KEY", "WECHAT_PAY_SERIAL_NO", "WECHAT_PAY_API_V3_KEY", "WECHAT_PAY_PLATFORM_PUBLIC_KEY", "WECHAT_PAY_PLATFORM_SERIAL_NO"]
        : ["PAYMENT_PROVIDER"];
    checks.push(required("payment-provider", "payments", names, env, "A signed production payment provider is configured"));
    checks.push(attestation("payment-e2e", "payments", "PAYMENT_E2E_ATTESTED_AT", 90, env, "Payment, refund, duplicate callback, invalid signature, and reconciliation tests are current"));
  } else {
    checks.push(disabled("payment-provider", "payments", "Payments are disabled for the pilot profile"));
    checks.push(disabled("payment-e2e", "payments", "Payment attestation is not required while payments are disabled"));
  }

  if (paid) {
    checks.push(attestation("legal-review", "legal", "LEGAL_REVIEW_ATTESTED_AT", 365, env, "Qualified legal review is current"));
    checks.push(attestation("ai-evaluation", "ai", "AI_EVAL_ATTESTED_AT", 30, env, "Real-provider safety and quality evaluation is current"));
    checks.push(attestation("restore-drill", "operations", "RESTORE_DRILL_ATTESTED_AT", 100, env, "A production-like restore drill is current"));
    checks.push(attestation("incident-drill", "operations", "INCIDENT_DRILL_ATTESTED_AT", 100, env, "An incident response exercise is current"));
    checks.push(attestation("security-review", "security", "SECURITY_REVIEW_ATTESTED_AT", 180, env, "Security and access-control review is current"));
    checks.push(attestation("retention-job", "operations", "RETENTION_JOB_VERIFIED_AT", 100, env, "Retention deletion job was verified recently"));
  }

  if (clinical || clinicalEnabled) {
    const review = expertReviewStatus();
    checks.push(review.pending === 0
      ? { id: "clinical-signoff", category: "clinical", status: "pass", message: "Every clinical module has named expert sign-off" }
      : { id: "clinical-signoff", category: "clinical", status: "fail", message: `${review.pending} clinical modules remain pending`, remediation: `Complete licensed review for: ${review.pendingKeys.join(", ")}` });
    checks.push(attestation("crisis-resources", "clinical", "CRISIS_RESOURCES_VERIFIED_AT", 90, env, "Regional crisis resources are current"));
  } else {
    checks.push(disabled("clinical-signoff", "clinical", "Clinical modules are disabled"));
    checks.push(disabled("crisis-resources", "clinical", "Clinical modules are disabled"));
  }

  if (family || childEnabled) {
    checks.push(truthy(env.CHILD_GUARDIAN_CONSENT_ENABLED)
      ? { id: "guardian-consent", category: "family", status: "pass", message: "Guardian consent enforcement is enabled" }
      : { id: "guardian-consent", category: "family", status: "fail", message: "Guardian consent enforcement is disabled", remediation: "Set CHILD_GUARDIAN_CONSENT_ENABLED=true after deploying the consent migration" });
    checks.push(attestation("child-safeguarding", "family", "CHILD_SAFETY_REVIEWED_AT", 365, env, "Child safeguarding review is current"));
    checks.push(attestation("child-privacy", "family", "CHILD_PRIVACY_REVIEWED_AT", 365, env, "Child privacy review is current"));
  } else {
    checks.push(disabled("guardian-consent", "family", "Child features are disabled"));
    checks.push(disabled("child-safeguarding", "family", "Child features are disabled"));
    checks.push(disabled("child-privacy", "family", "Child features are disabled"));
  }

  if (enterprise) {
    checks.push(truthy(env.ENTERPRISE_RBAC_ENABLED)
      ? { id: "enterprise-rbac", category: "enterprise", status: "pass", message: "Enterprise role enforcement is enabled" }
      : { id: "enterprise-rbac", category: "enterprise", status: "fail", message: "Enterprise RBAC is disabled", remediation: "Set ENTERPRISE_RBAC_ENABLED=true after validating owner/admin/member/viewer permissions" });
    checks.push(attestation("access-review", "enterprise", "ACCESS_REVIEW_ATTESTED_AT", 90, env, "Enterprise access review is current"));
  }

  const failed = checks.filter((check) => check.status === "fail").map((check) => check.id);
  return { profile, ready: failed.length === 0, generatedAt: new Date().toISOString(), checks, failed };
}

export function runtimeReadiness(env: NodeJS.ProcessEnv = process.env) {
  const commercial = releaseReadiness(env, profileFrom(env.RELEASE_PROFILE));
  const runtimeIds = new Set(["runtime-core", "auth-secret-strength", "registration-mode", "real-ai-provider", "ai-credentials", "ai-runtime", "legal-documents", "legal-version", "retention-policy", "transactional-email", "observability"]);
  const checks = commercial.checks.filter((check) => runtimeIds.has(check.id));
  const failed = checks.filter((check) => check.status === "fail").map((check) => check.id);
  return { ready: failed.length === 0, checks, failed, profile: commercial.profile };
}
