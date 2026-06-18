// ───────────────────── Healing OS · Dilts/5P formulation service ─────────────────────
// Wraps the DiltsFormulation agent with deterministic guarantees: orange risk
// forces "shallow" depth; the causal loop (≥3 edges) and ordered intervention
// path are computed from pure logic; risk-aware cautions are always present.
// Red risk is blocked upstream. Persisted to DiltsClinicalFormulation.

import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { DiltsFormulation as DiltsFormulationAgent } from "../agents/healing";
import { recommendInterventionPath, buildCausalLoop } from "./dilts-logic";
import {
  type DiltsClinicalFormulationInput,
  type DiltsClinicalFormulationOutput,
  type FormulationDepth,
  DiltsCoreSchema,
} from "../domain/dilts";

export interface FormulationResult extends DiltsClinicalFormulationOutput {
  formulationId: string;
  depth: FormulationDepth;
}

export async function runDiltsFormulation(
  input: DiltsClinicalFormulationInput,
): Promise<FormulationResult> {
  const risk = input.context.safetyRiskLevel;
  if (risk === "red") throw new Error("Dilts formulation blocked during red risk state.");

  // Orange → shallow, stabilization-oriented; otherwise honor user preference.
  const depth: FormulationDepth = risk === "orange" ? "shallow" : input.userPreferences?.depth ?? "standard";

  let core;
  try {
    core = await DiltsFormulationAgent.run({
      problemStatement: input.problemStatement,
      depth,
      primaryConcerns: input.context.primaryConcerns ?? [],
      dominantEmotions: input.context.dominantEmotions ?? [],
      maintainingLoops: input.context.maintainingLoops ?? [],
      language: input.userPreferences?.language ?? "zh",
    });
  } catch (e) {
    reportError(e, { surface: "dilts", stage: "formulate" });
    core = DiltsCoreSchema.parse({
      diltsMap: {},
      fiveP: { protectiveFactors: ["你愿意正视并整理自己的困扰，这是重要的资源。"] },
      formulationSummary: "我们先记录下你的问题，下一步可以逐层展开。",
    });
  }

  // Deterministic, always-present structure.
  const causalLoop = buildCausalLoop(core.diltsMap, core.fiveP);
  const recommendedInterventionPath = recommendInterventionPath(core.diltsMap, core.fiveP, {
    dominantEmotions: input.context.dominantEmotions,
  });
  const cautions = buildCautions(depth, risk);

  const output: DiltsClinicalFormulationOutput = {
    diltsMap: core.diltsMap,
    fiveP: core.fiveP,
    causalLoop,
    formulationSummary: core.formulationSummary,
    recommendedInterventionPath,
    cautions,
  };

  const formulationId = await persistFormulation(input, output, depth);
  return { ...output, formulationId, depth };
}

function buildCautions(depth: FormulationDepth, risk: string): string[] {
  const base = [
    "这不是医学诊断，也不能替代心理治疗师、精神科医生或危机服务。",
    "对成因的推测使用谨慎语言，不代表确定的因果。",
  ];
  if (depth === "shallow" || risk === "orange") {
    base.push("当前处于需要稳定化的状态，本次只做浅层梳理，暂不进行深度信念/创伤工作。");
  }
  return base;
}

async function persistFormulation(
  input: DiltsClinicalFormulationInput,
  output: DiltsClinicalFormulationOutput,
  depth: FormulationDepth,
): Promise<string> {
  try {
    const row = await prisma.diltsClinicalFormulation.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        intakeId: input.intakeId,
        problemStatement: input.problemStatement,
        depth,
        diltsMap: output.diltsMap,
        fiveP: output.fiveP,
        causalLoop: output.causalLoop,
        formulationSummary: output.formulationSummary,
        recommendedInterventionPath: output.recommendedInterventionPath,
        cautions: output.cautions,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId,
      sessionId: input.sessionId,
      module: "dilts",
      type: "FormulationCreated",
      recordId: row.id,
      payload: { depth, interventionPath: output.recommendedInterventionPath.map((s) => s.skill) },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "dilts", stage: "persist" });
    return "";
  }
}
