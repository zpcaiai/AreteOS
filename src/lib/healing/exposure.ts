// ───────────────────── Healing OS · Exposure service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTask } from "./practice";
import { checkExposureContraindications, clampHierarchy, recommendExposureNextSkills, exposurePracticeTask } from "./exposure-logic";
import { ExposureEngine } from "../agents/healing-exposure";
import { type ExposureInput, type ExposureOutput, type ExposureCore, type ExposureAttemptInput, ExposureCoreSchema } from "../domain/exposure";

export interface ExposureResult extends ExposureOutput {
  planId: string;
}

export async function runExposureEngine(input: ExposureInput): Promise<ExposureResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Exposure is blocked during red risk state.");
  if (risk === "orange") throw new Error("Exposure is not available during orange risk; route to stabilization.");

  // Hard, deterministic contraindication gate (trauma / danger / OCD).
  const contra = checkExposureContraindications(input);
  if (contra.blocked) {
    const planId = await persistBlocked(input, contra.reason ?? "contraindicated");
    return {
      blocked: true,
      blockReason: contra.reason,
      avoidanceLoop: { trigger: "", fearPrediction: "", emotion: "", avoidanceBehavior: "", safetyBehaviors: [], shortTermRelief: "", longTermCost: "" },
      exposureType: "custom",
      hierarchy: [{ level: 1, title: "—", action: "—", predictedDistress: 0, difficulty: "easy", safetyNotes: "", successCriteria: "—" }],
      selectedExperiment: { title: "—", oldPrediction: "", newLearningTarget: "", actionSteps: [], duration: "", measurement: { beforeDistress: "", peakDistress: "", afterDistress: "", actualOutcome: "", learningStatement: "" }, stopRules: [] },
      reflectionTemplate: { beforeQuestions: [], duringQuestions: [], afterQuestions: [] },
      nextRecommendedSkills: contra.reason === "trauma" ? ["emotion-regulation"] : ["emotion-regulation"],
      cautions: [blockMessage(contra.reason)],
      planId,
    };
  }

  let core: ExposureCore;
  try {
    core = clampHierarchy(
      await ExposureEngine.run({
        avoidanceProblem: input.avoidanceProblem,
        fearPrediction: input.fearPrediction ?? "",
        currentAvoidanceBehaviors: input.currentAvoidanceBehaviors ?? [],
        safetyBehaviors: input.safetyBehaviors ?? [],
        language: "zh",
      }),
    );
  } catch (e) {
    reportError(e, { surface: "exposure", stage: "run" });
    core = clampHierarchy(
      ExposureCoreSchema.parse({
        avoidanceLoop: { trigger: input.avoidanceProblem, fearPrediction: "", emotion: "", avoidanceBehavior: "", safetyBehaviors: [], shortTermRelief: "", longTermCost: "" },
        exposureType: "custom",
        hierarchy: [{ level: 1, title: "最小一步", action: "做一个最小的接近行为", predictedDistress: 2, difficulty: "easy", safetyNotes: "", successCriteria: "完成接近即成功" }],
        selectedExperiment: { title: "最小一步", oldPrediction: "", newLearningTarget: "接近不会带来灾难", actionSteps: ["做一个最小接近行为"], duration: "一次", measurement: { beforeDistress: "0-10", peakDistress: "0-10", afterDistress: "0-10", actualOutcome: "实际发生了什么", learningStatement: "学到的一句话" }, stopRules: ["不安全就停下"] },
        reflectionTemplate: { beforeQuestions: [], duringQuestions: [], afterQuestions: [] },
      }),
    );
  }

  const output: ExposureOutput = {
    ...core,
    blocked: false,
    nextRecommendedSkills: recommendExposureNextSkills(core, risk),
    cautions: ["这是自助暴露训练，不替代专业治疗；成功标准是'接近并记录'，不是'完全不焦虑'。", "任何时候都可以停下，绝不强迫升级难度。"],
  };

  const planId = await persist(input, output);
  if (planId) await createPracticeTask(exposurePracticeTask(core, { userId: input.userId, sessionId: input.sessionId, sourceId: planId }));
  return { ...output, planId };
}

function blockMessage(reason?: string): string {
  if (reason === "trauma") return "这看起来与创伤相关。我们不在这里做创伤暴露——先做稳定化，并在受训专业人员的陪伴下处理。";
  if (reason === "danger") return "这涉及现实安全风险。系统不会设计这类暴露任务；如有自伤/他伤风险，请联系危机服务。";
  if (reason === "ocd") return "这看起来与强迫相关。强迫的 ERP 需要专业人员指导，本工具不替代。";
  return "该请求超出自助暴露的安全范围，建议寻求专业支持。";
}

async function persist(input: ExposureInput, output: ExposureOutput): Promise<string> {
  try {
    const row = await prisma.exposurePlan.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        avoidanceProblem: input.avoidanceProblem,
        relatedCBTSessionId: input.relatedCBTSessionId,
        relatedBeliefRecordId: input.relatedBeliefRecordId,
        relatedFormulationId: input.relatedFormulationId,
        blocked: false,
        avoidanceLoop: output.avoidanceLoop,
        exposureType: output.exposureType,
        hierarchy: output.hierarchy,
        selectedExperiment: output.selectedExperiment,
        reflectionTemplate: output.reflectionTemplate,
        nextRecommendedSkills: output.nextRecommendedSkills,
        cautions: output.cautions,
      },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId: input.sessionId, module: "exposure", type: "ExposurePlanCreated", recordId: row.id, payload: { exposureType: output.exposureType, levels: output.hierarchy.length } });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "exposure", stage: "persist" });
    return "";
  }
}

async function persistBlocked(input: ExposureInput, reason: string): Promise<string> {
  try {
    const row = await prisma.exposurePlan.create({
      data: { userId: input.userId, sessionId: input.sessionId, avoidanceProblem: input.avoidanceProblem, blocked: true, blockReason: reason },
      select: { id: true },
    });
    await recordHealingEvent({ userId: input.userId, sessionId: input.sessionId, module: "exposure", type: "ExposureBlocked", recordId: row.id, payload: { reason } });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "exposure", stage: "persist-blocked" });
    return "";
  }
}

export async function recordExposureAttempt(input: ExposureAttemptInput): Promise<{ id: string } | null> {
  try {
    const row = await prisma.exposureAttempt.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        exposurePlanId: input.exposurePlanId,
        hierarchyLevel: input.hierarchyLevel,
        beforeDistress: input.beforeDistress,
        peakDistress: input.peakDistress,
        afterDistress: input.afterDistress,
        actualOutcome: input.actualOutcome,
        learningStatement: input.learningStatement,
        safetyBehaviorsUsed: input.safetyBehaviorsUsed ?? undefined,
        completed: input.completed,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "exposure-attempt", type: input.completed ? "ExposureAttemptCompleted" : "ExposureAttemptLogged", recordId: row.id,
      payload: { level: input.hierarchyLevel, completed: input.completed, before: input.beforeDistress, after: input.afterDistress },
    });
    return { id: row.id };
  } catch (e) {
    reportError(e, { surface: "exposure", stage: "attempt" });
    return null;
  }
}
