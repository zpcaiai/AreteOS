// ───────────────────── Healing OS · unified workflows ─────────────────────
// Thin routers that dispatch to the right skill based on risk + chosen path.
// They make the "one long-term loop" explicit: intervention → deep pattern →
// long-term growth. Red always short-circuits to crisis; orange stays
// stabilization-oriented. Each delegated service still enforces its own gate.

import type { RiskLevel } from "../domain/risk";
import { runCoreBeliefReconstruction } from "./core-belief";
import { runCBT } from "./cbt";
import { runEmotionRegulation } from "./emotion-regulation";
import { runTraumaStabilization } from "./stabilization";
import { runPartsWork } from "./parts-work";
import { runExposureEngine } from "./exposure";
import { runIdentityReconstruction } from "./identity";
import { runHealingTimeline } from "./healing-timeline";
import { runRelapsePrevention } from "./relapse-prevention";

const CRISIS = { route: "urgent_crisis_response" as const, allowed: false as const };
const STABILIZE = { route: "stabilization" as const, allowed: false as const };

interface Base {
  userId: string;
  sessionId: string;
  problemStatement: string;
  safetyRiskLevel: RiskLevel;
  formulationId?: string;
  beliefRecordId?: string;
}

/** Batch 2 — core intervention layer. */
export async function runInterventionSession(input: Base & { preferredPath?: "belief" | "cbt" | "emotion" }) {
  if (input.safetyRiskLevel === "red") return CRISIS;
  const safetyContext = { riskLevel: input.safetyRiskLevel };
  if (input.preferredPath === "belief")
    return runCoreBeliefReconstruction({ userId: input.userId, sessionId: input.sessionId, problemStatement: input.problemStatement, formulationId: input.formulationId, safetyContext });
  if (input.preferredPath === "emotion")
    return runEmotionRegulation({ userId: input.userId, sessionId: input.sessionId, currentEmotionText: input.problemStatement, safetyContext });
  return runCBT({ userId: input.userId, sessionId: input.sessionId, situation: input.problemStatement, formulationId: input.formulationId, mode: "thought_record", safetyContext });
}

/** Batch 3 — deep-pattern layer. Orange → stabilization only. */
export async function runDeepPatternWorkflow(input: Base & { preferredPath: "stabilization" | "parts" | "exposure"; cbtSessionId?: string }) {
  if (input.safetyRiskLevel === "red") return CRISIS;
  const safetyContext = { riskLevel: input.safetyRiskLevel };
  if (input.safetyRiskLevel === "orange")
    return runTraumaStabilization({ userId: input.userId, sessionId: input.sessionId, currentExperience: input.problemStatement, safetyContext });
  if (input.preferredPath === "stabilization")
    return runTraumaStabilization({ userId: input.userId, sessionId: input.sessionId, currentExperience: input.problemStatement, safetyContext });
  if (input.preferredPath === "parts")
    return runPartsWork({ userId: input.userId, sessionId: input.sessionId, currentConflict: input.problemStatement, relatedFormulationId: input.formulationId, relatedBeliefRecordId: input.beliefRecordId, mode: "parts_mapping", safetyContext });
  return runExposureEngine({ userId: input.userId, sessionId: input.sessionId, avoidanceProblem: input.problemStatement, relatedFormulationId: input.formulationId, relatedBeliefRecordId: input.beliefRecordId, relatedCBTSessionId: input.cbtSessionId, safetyContext });
}

/** Batch 4 — long-term growth layer. */
export async function runLongTermGrowthWorkflow(input: {
  userId: string;
  sessionId?: string;
  mode: "identity" | "timeline" | "relapse";
  currentConcern?: string;
  safetyRiskLevel: RiskLevel;
  timeRange?: { from: string; to: string };
}) {
  if (input.safetyRiskLevel === "red") return CRISIS;
  const sessionId = input.sessionId ?? "growth";

  if (input.mode === "identity")
    return runIdentityReconstruction({
      userId: input.userId, sessionId, currentIdentityPain: input.currentConcern ?? "I want to rebuild my identity.",
      mode: input.safetyRiskLevel === "orange" ? "light_identity_stabilization" : "identity_mapping",
      safetyContext: { riskLevel: input.safetyRiskLevel },
    });

  if (input.mode === "timeline") {
    const to = input.timeRange?.to ?? new Date().toISOString();
    const from = input.timeRange?.from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return runHealingTimeline({ userId: input.userId, sessionId, timeRange: { from, to }, reportMode: "weekly" });
  }

  if (input.safetyRiskLevel === "orange") return STABILIZE;
  // green/yellow only here (red + orange returned above).
  return runRelapsePrevention({
    userId: input.userId, sessionId, currentConcern: input.currentConcern,
    mode: "create_plan",
    safetyContext: { riskLevel: input.safetyRiskLevel },
  });
}
