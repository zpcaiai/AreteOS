// ───────────────────── Healing OS · CBT service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTask } from "./practice";
import { detectCBTMode, recommendCBTNextSkills, behaviorPlanToPracticeTask } from "./cbt-logic";
import { CBTBehavioralChange } from "../agents/healing-cbt";
import { type CBTInput, type CBTOutput, type CBTCore, CBTCoreSchema } from "../domain/cbt";

export interface CBTResult extends CBTOutput {
  recordId: string;
  mode: string;
}

export async function runCBT(input: CBTInput): Promise<CBTResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("CBT is blocked during red risk state.");
  const mode = detectCBTMode(input.situation, input.mode);

  let core: CBTCore;
  try {
    core = await CBTBehavioralChange.run({
      situation: input.situation,
      mode,
      emotions: input.currentState?.emotions ?? [],
      urges: input.currentState?.urges ?? [],
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "cbt", stage: "run" });
    core = CBTCoreSchema.parse({
      cbtMap: { situation: input.situation, automaticThoughts: [], emotions: [], behaviors: [], outcomeLoop: "" },
      evidenceCheck: {},
      behaviorPlan: { planType: "task_breakdown", title: "一个 10 分钟的最小起步", steps: ["设 10 分钟计时", "只做最小的第一步"], difficulty: "easy", measurement: "是否开始" },
    });
  }

  const output: CBTOutput = { ...core, nextRecommendedSkills: recommendCBTNextSkills(core, risk) };
  const recordId = await persist(input, output, mode);
  if (recordId) await createPracticeTask(behaviorPlanToPracticeTask(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
  return { ...output, recordId, mode };
}

async function persist(input: CBTInput, output: CBTOutput, mode: string): Promise<string> {
  try {
    const row = await prisma.cBTSession.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        mode,
        situation: input.situation,
        relatedBeliefRecordId: input.relatedBeliefRecordId,
        formulationId: input.formulationId,
        cbtMap: output.cbtMap,
        cognitiveDistortions: output.cognitiveDistortions,
        evidenceCheck: output.evidenceCheck,
        alternativeThoughts: output.alternativeThoughts,
        behaviorPlan: output.behaviorPlan,
        reflectionQuestions: output.reflectionQuestions,
        nextRecommendedSkills: output.nextRecommendedSkills,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "cbt", type: "CBTSessionCompleted", recordId: row.id,
      payload: { mode, distortions: output.cognitiveDistortions.map((d) => d.distortion) },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "cbt", stage: "persist" });
    return "";
  }
}
