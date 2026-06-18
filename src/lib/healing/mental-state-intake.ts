// ─────────────────── Healing OS · Mental-state intake service ───────────────────
// Deterministic loop detection + next-skill routing fused with the LLM's richer
// narrative. Red risk is blocked upstream (route returns 409); orange runs a
// stabilization-only routing. Persisted to MentalStateIntake.

import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { MentalStateIntake as MentalStateIntakeAgent } from "../agents/healing";
import { detectMaintainingLoops, recommendNextSkills } from "./intake-logic";
import {
  type MentalStateIntakeInput,
  type MentalStateIntakeOutput,
  MentalStateIntakeOutputSchema,
} from "../domain/mental-state";
import type { RiskLevel } from "../domain/risk";

export interface IntakeResult extends MentalStateIntakeOutput {
  intakeId: string;
}

export async function runMentalStateIntake(
  input: MentalStateIntakeInput,
  riskLevel: RiskLevel = "green",
): Promise<IntakeResult> {
  if (riskLevel === "red") throw new Error("Intake blocked during red risk state.");

  const probe = { freeText: input.freeText, ratings: input.ratings, checkboxes: input.checkboxes };
  const deterministicLoops = detectMaintainingLoops(probe);

  let output: MentalStateIntakeOutput;
  try {
    output = await MentalStateIntakeAgent.run({
      freeText: input.freeText ?? "",
      ratings: (input.ratings ?? {}) as Record<string, number>,
      checkboxes: (input.checkboxes ?? {}) as Record<string, boolean>,
      riskLevel,
      detectedLoopHints: deterministicLoops.map((l) => l.kind ?? l.loopName),
    });
  } catch (e) {
    reportError(e, { surface: "intake", stage: "analyze" });
    // Minimal, schema-valid fallback built from deterministic signals only.
    output = MentalStateIntakeOutputSchema.parse({
      summary: "已记录你的初始状态。我们先用结构化的方式整理你目前的困扰。",
      primaryConcerns: [],
      emotionalProfile: { dominantEmotions: [], intensityPattern: "", bodySignals: [] },
      functionalImpact: { workOrStudy: "mild", relationships: "mild", selfCare: "mild", sleep: "mild" },
      likelyMaintainingLoops: deterministicLoops,
      suggestedNextSkills: [],
    });
  }

  // Merge: union deterministic + model loops (dedup by kind/name); the
  // next-skill routing is ALWAYS the deterministic one (risk-aware).
  const seen = new Set(output.likelyMaintainingLoops.map((l) => l.kind ?? l.loopName));
  for (const l of deterministicLoops) {
    if (!seen.has(l.kind ?? l.loopName)) output.likelyMaintainingLoops.push(l);
  }
  output.suggestedNextSkills = recommendNextSkills(probe, output.likelyMaintainingLoops, riskLevel);

  const intakeId = await persistMentalStateIntake(input, output, riskLevel);
  return { ...output, intakeId };
}

async function persistMentalStateIntake(
  input: MentalStateIntakeInput,
  output: MentalStateIntakeOutput,
  riskLevel: RiskLevel,
): Promise<string> {
  try {
    const row = await prisma.mentalStateIntake.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        freeText: input.freeText,
        ratings: input.ratings ?? undefined,
        checkboxes: input.checkboxes ?? undefined,
        summary: output.summary,
        primaryConcerns: output.primaryConcerns,
        emotionalProfile: output.emotionalProfile,
        functionalImpact: output.functionalImpact,
        maintainingLoops: output.likelyMaintainingLoops,
        suggestedNextSkills: output.suggestedNextSkills,
        riskLevelAtIntake: riskLevel,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId,
      sessionId: input.sessionId,
      module: "intake",
      type: "MentalStateAssessed",
      recordId: row.id,
      payload: { riskLevel, loops: output.likelyMaintainingLoops.map((l) => l.kind ?? l.loopName), nextSkills: output.suggestedNextSkills },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "intake", stage: "persist" });
    return "";
  }
}
