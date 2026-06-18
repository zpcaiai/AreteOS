// ───────────────────── Healing OS · Safety-triage service ─────────────────────
// Orchestrates the safety gate: deterministic keyword pre-screen → LLM
// classifier → escalate-only override + policy (composeTriage) → persist. The
// LLM can refine but never lower a rule-determined risk. Persisted to
// SafetyTriageEvent as an audit trail.

import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { SafetyTriageClassifier } from "../agents/healing";
import {
  keywordPreScreen,
  toDetectedSignals,
  composeTriage,
  conservativeFallback,
} from "./safety-rules";
import {
  type SafetyTriageInput,
  type SafetyTriageOutput,
  SafetyClassificationSchema,
} from "../domain/risk";

export async function runSafetyTriage(input: SafetyTriageInput): Promise<SafetyTriageOutput> {
  const locale = input.context?.locale ?? "zh-CN";
  const raw = keywordPreScreen(input.message);

  let classification;
  let supportiveMessage = "";
  try {
    const out = await SafetyTriageClassifier.run({
      message: input.message,
      previousRiskLevel: input.context?.previousRiskLevel,
      recentMoodScore: input.context?.recentMoodScore,
      keywordSignals: toDetectedSignals(raw).map((s) => s.signal),
    });
    supportiveMessage = out.supportiveMessage ?? "";
    // Validate against the classification subset; on failure → conservative fallback.
    classification = SafetyClassificationSchema.parse({
      riskLevel: out.riskLevel,
      riskDomains: out.riskDomains,
      confidence: out.confidence,
      detectedSignals: out.detectedSignals,
    });
  } catch (e) {
    reportError(e, { surface: "safety-triage", stage: "classify" });
    // Fail safe: never green on a model/parse failure.
    classification = conservativeFallback(input.message).classification;
  }

  const { output, overridden } = composeTriage(classification, raw, { locale, supportiveMessage });

  await persistSafetyTriageEvent(input, output, overridden);
  return output;
}

async function persistSafetyTriageEvent(input: SafetyTriageInput, output: SafetyTriageOutput, overridden: boolean) {
  try {
    await prisma.safetyTriageEvent.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        inputMessage: input.message,
        riskLevel: output.riskLevel,
        riskDomains: output.riskDomains,
        confidence: output.confidence,
        detectedSignals: output.detectedSignals,
        recommendedRoute: output.recommendedRoute,
        userFacingMessage: output.userFacingMessage,
        allowedNextSkills: output.allowedNextSkills,
        blockedSkills: output.blockedSkills,
        safetyPlan: output.safetyPlan ?? undefined,
        overridden,
      },
      select: { id: true },
    }).then((row: { id: string }) =>
      recordHealingEvent({
        userId: input.userId,
        sessionId: input.sessionId,
        module: "safety",
        type: "SafetyTriaged",
        recordId: row.id,
        payload: { riskLevel: output.riskLevel, riskDomains: output.riskDomains, overridden },
      }),
    );
  } catch (e) {
    // Persistence must never block returning a safe response to the user.
    reportError(e, { surface: "safety-triage", stage: "persist" });
  }
}

/** Latest triage for a session — used to gate the intake & formulation routes. */
export async function getLatestSafetyTriage(userId: string, sessionId: string) {
  const row = await prisma.safetyTriageEvent.findFirst({
    where: { userId, sessionId },
    orderBy: { createdAt: "desc" },
    select: { riskLevel: true, riskDomains: true, recommendedRoute: true, blockedSkills: true, createdAt: true },
  });
  return row;
}
