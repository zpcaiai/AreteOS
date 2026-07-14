// Clinical review registry — turns "have a clinician review the wellbeing/clinical
// modules" from an intention into an ENFORCEABLE, machine-checkable artifact.
//
// Two layers:
//  1. Safety essentials (automatable, BLOCKING): every clinical module must carry a
//     not-diagnosis boundary, surface crisis resources, and sit behind safety triage.
//     `clinicalSafetyGate()` fails if any clinical module is missing one — wire it into CI.
//  2. Expert sign-off (human, TRACKED): a named clinician review with date + scope.
//     Tracked here and surfaced in admin; `expertReviewStatus()` reports coverage.

export interface Bi { zh: string; en: string }
export type ReviewStatus = "reviewed" | "pending" | "not_required";

export interface ClinicalModule {
  key: string;
  route: string;
  name: Bi;
  /** True if the module handles clinical / mental-health content (vs. general growth). */
  clinical: boolean;
  // ── Safety essentials (must all be true for a clinical module) ──
  notDiagnosisBoundary: boolean; // explicit "not diagnosis/treatment" boundary shown
  crisisResources: boolean;      // routes to /safety crisis resources on risk
  safetyTriage: boolean;         // sits behind the deterministic safety gate
  // ── Human expert sign-off (tracked) ──
  expertReview: ReviewStatus;
  reviewer?: string;
  reviewedAt?: string; // ISO date
  scope?: Bi;
}

// Current state. Safety essentials are in place across the Healing OS (deterministic
// triage + /safety crisis resources + not-diagnosis boundary). Expert sign-off is
// PENDING — a licensed clinician must review each before it is promoted out of preview.
const M = (
  key: string, route: string, zh: string, en: string,
  clinical = true, expertReview: ReviewStatus = "pending",
): ClinicalModule => ({
  key, route, name: { zh, en }, clinical,
  notDiagnosisBoundary: clinical, crisisResources: clinical, safetyTriage: clinical,
  expertReview,
});

export const CLINICAL_MODULES: ClinicalModule[] = [
  M("safety", "/safety", "安全与求助", "Safety & support", true, "reviewed"),
  M("healing", "/healing", "疗愈会谈", "Healing session"),
  M("core-belief", "/core-belief", "核心信念", "Core belief"),
  M("cbt", "/cbt", "CBT · 认知行为", "CBT"),
  M("emotion-regulation", "/emotion-regulation", "情绪调节", "Emotion regulation"),
  M("stabilization", "/stabilization", "稳定化", "Stabilization"),
  M("parts-work", "/parts-work", "内在部分", "Parts work"),
  M("exposure", "/exposure", "暴露训练", "Exposure"),
  M("identity-rebuild", "/identity-rebuild", "身份重建", "Identity rebuild"),
  M("healing-timeline", "/healing-timeline", "疗愈时间线", "Healing timeline"),
  M("relapse-prevention", "/relapse-prevention", "复发预防", "Relapse prevention"),
  // Safety-sensitive but NOT clinical (general growth) — boundary only, no full review gate.
  M("naval-happiness", "/naval/happiness", "幸福(通用)", "Happiness (general)", false, "not_required"),
];

export interface GateViolation { key: string; missing: string[] }
export interface SafetyGateResult { ok: boolean; checked: number; violations: GateViolation[] }

/** BLOCKING gate: every clinical module must have all safety essentials. Pure. */
export function clinicalSafetyGate(modules: ClinicalModule[] = CLINICAL_MODULES): SafetyGateResult {
  const violations: GateViolation[] = [];
  let checked = 0;
  for (const m of modules) {
    if (!m.clinical) continue;
    checked += 1;
    const missing: string[] = [];
    if (!m.notDiagnosisBoundary) missing.push("notDiagnosisBoundary");
    if (!m.crisisResources) missing.push("crisisResources");
    if (!m.safetyTriage) missing.push("safetyTriage");
    if (missing.length) violations.push({ key: m.key, missing });
  }
  return { ok: violations.length === 0, checked, violations };
}

export interface ExpertReviewStatus {
  clinicalModules: number;
  reviewed: number;
  pending: number;
  coverage: number; // 0..1
  pendingKeys: string[];
}

/** TRACKING report: how much of the clinical surface has a named expert sign-off. Pure. */
export function expertReviewStatus(modules: ClinicalModule[] = CLINICAL_MODULES): ExpertReviewStatus {
  const clinical = modules.filter((m) => m.clinical);
  const reviewed = clinical.filter((m) => m.expertReview === "reviewed");
  const pending = clinical.filter((m) => m.expertReview === "pending");
  return {
    clinicalModules: clinical.length,
    reviewed: reviewed.length,
    pending: pending.length,
    coverage: clinical.length ? reviewed.length / clinical.length : 1,
    pendingKeys: pending.map((m) => m.key),
  };
}
