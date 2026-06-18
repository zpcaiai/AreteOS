// ───────────────────── Healing OS · Parts-work service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTask } from "./practice";
import { resolvePartsWorkMode, recommendPartsNextSkills, partsPracticeTask } from "./parts-logic";
import { PartsWork } from "../agents/healing-parts";
import { type PartsWorkInput, type PartsWorkOutput, type PartsWorkCore, PartsWorkCoreSchema } from "../domain/parts-work";

export interface PartsWorkResult extends PartsWorkOutput {
  recordId: string;
  mode: string;
}

export async function runPartsWork(input: PartsWorkInput): Promise<PartsWorkResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Parts work is blocked during red risk state.");
  const mode = resolvePartsWorkMode(input.mode, risk);

  let core: PartsWorkCore;
  try {
    core = await PartsWork.run({
      currentConflict: input.currentConflict,
      mode,
      coreBeliefs: input.knownPatterns?.coreBeliefs ?? [],
      behaviors: input.knownPatterns?.behaviors ?? [],
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "parts-work", stage: "run" });
    core = PartsWorkCoreSchema.parse({
      partsMap: [{ partName: "未命名部分", partType: "unknown", voice: input.currentConflict, emotion: "", urge: "", protectionGoal: "", fearIfNotProtected: "", costOfExtremeStrategy: "", whatItNeeds: "" }],
      internalConflictSummary: { conflictPattern: "", polarizedParts: [], sharedPositiveIntention: "都在试图保护你", mainRisk: "" },
      healthyAdultResponse: { stance: "我看到每个部分都在努力。", validationForEachPart: [], integrativeStatement: "" },
      practiceTask: { title: "内在 check-in", steps: ["谢谢出现的部分", "问它在保护什么"], duration: "5 分钟", safetyStopRule: "情绪被淹没就停下做呼吸" },
    });
  }

  const output: PartsWorkOutput = {
    ...core,
    nextRecommendedSkills: recommendPartsNextSkills(core, risk),
    cautions: ["这不是诊断，也不意味着多重人格；这是一种自我觉察的方式。", "如果出现强烈被淹没的感受，请先稳定化，必要时寻求专业支持。"],
  };

  const recordId = await persist(input, output, mode);
  if (recordId) await createPracticeTask(partsPracticeTask(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
  return { ...output, recordId, mode };
}

async function persist(input: PartsWorkInput, output: PartsWorkOutput, mode: string): Promise<string> {
  try {
    const row = await prisma.partsWorkSession.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        mode,
        currentConflict: input.currentConflict,
        relatedFormulationId: input.relatedFormulationId,
        relatedBeliefRecordId: input.relatedBeliefRecordId,
        partsMap: output.partsMap,
        internalConflictSummary: output.internalConflictSummary,
        healthyAdultResponse: output.healthyAdultResponse,
        innerDialogueScript: output.innerDialogueScript,
        practiceTask: output.practiceTask,
        nextRecommendedSkills: output.nextRecommendedSkills,
        cautions: output.cautions,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "parts-work", type: "PartsMapped", recordId: row.id,
      payload: { mode, parts: output.partsMap.map((p) => p.partType) },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "parts-work", stage: "persist" });
    return "";
  }
}
