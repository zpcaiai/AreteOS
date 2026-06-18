// ───────────────────── Healing OS · Stabilization service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { classifyTraumaArousal, classifyOrientation, stabilizationPriority, selectStabilizationProtocol, blockedStabilizationSkills } from "./stabilization-logic";
import { TraumaStabilization } from "../agents/healing-stabilization";
import {
  type TraumaStabilizationInput,
  type TraumaStabilizationOutput,
  type TraumaStabilizationCore,
  TraumaStabilizationCoreSchema,
  STAB_BLOCKED_SKILLS,
  STAB_NEXT_SKILLS,
} from "../domain/trauma-stabilization";

export interface StabilizationResult extends TraumaStabilizationOutput {
  recordId: string;
}

export async function runTraumaStabilization(input: TraumaStabilizationInput): Promise<StabilizationResult> {
  // Red is handled at the route (crisis route). Stabilization itself runs for
  // yellow/orange (orange's whole point IS stabilization).
  if (input.safetyContext.riskLevel === "red") throw new Error("Routed to urgent crisis response.");

  const arousal = classifyTraumaArousal(input);
  const orientation = classifyOrientation(input);
  const priority = stabilizationPriority(arousal, input);
  const protocol = selectStabilizationProtocol(input, arousal);
  const symptomList = Object.entries(input.symptoms ?? {}).filter(([, v]) => v).map(([k]) => k);

  let core: TraumaStabilizationCore;
  try {
    core = await TraumaStabilization.run({
      currentExperience: input.currentExperience,
      arousalGuess: arousal,
      orientationGuess: orientation,
      priorityGuess: priority,
      protocolGuess: protocol,
      symptoms: symptomList,
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "stabilization", stage: "run" });
    core = TraumaStabilizationCoreSchema.parse({
      stabilizationAssessment: { arousalState: arousal, presentOrientation: orientation, stabilizationPriority: priority, doNotProceedWith: ["回忆细节", "深入分析"] },
      userFacingValidation: "我们先回到当下，慢慢稳定下来。你不需要现在去回忆任何事。",
      immediateProtocol: { title: "回到当下", duration: "1-2 分钟", steps: ["双脚踩地", "说出现在的日期和地点", "说出你看到的 5 个东西"], stopSignals: ["如有伤害自己/他人的冲动，请立即联系危机热线或身边可信的人"] },
      groundingPlan: { sensoryAnchors: ["握住一个物体"], bodyAnchors: ["双脚踩地"], environmentAnchors: ["说出墙的颜色"], phraseAnchors: ["现在是安全的当下"] },
    });
  }

  // Deterministic safety: deep work is ALWAYS blocked during stabilization.
  const blockedSkills = blockedStabilizationSkills();
  const nextAllowedSkills: (typeof STAB_NEXT_SKILLS)[number][] =
    priority === "up_regulation" || priority === "down_regulation" || priority === "grounding"
      ? ["practice-task", "emotion-regulation", "safety-planning"]
      : ["emotion-regulation", "cbt", "practice-task"];

  const output: TraumaStabilizationOutput = { ...core, blockedSkills, nextAllowedSkills };
  const recordId = await persist(input, output);
  return { ...output, recordId };
}

async function persist(input: TraumaStabilizationInput, output: TraumaStabilizationOutput): Promise<string> {
  try {
    const row = await prisma.traumaStabilizationSession.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        currentExperience: input.currentExperience,
        symptoms: input.symptoms ?? undefined,
        bodySignals: input.bodySignals ?? undefined,
        orientation: input.orientation ?? undefined,
        stabilizationAssessment: output.stabilizationAssessment,
        userFacingValidation: output.userFacingValidation,
        immediateProtocol: output.immediateProtocol,
        groundingPlan: output.groundingPlan,
        flashbackPlan: output.flashbackPlan ?? undefined,
        dissociationPlan: output.dissociationPlan ?? undefined,
        supportPlan: output.supportPlan ?? undefined,
        nextAllowedSkills: output.nextAllowedSkills,
        blockedSkills: output.blockedSkills,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "stabilization", type: "Stabilized", recordId: row.id,
      payload: { arousal: output.stabilizationAssessment.arousalState, priority: output.stabilizationAssessment.stabilizationPriority },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "stabilization", stage: "persist" });
    return "";
  }
}
