// ───────────────────── Healing OS · Emotion-regulation service ─────────────────────
import { prisma } from "../db";
import { reportError } from "../logger";
import { recordHealingEvent } from "./events";
import { createPracticeTask } from "./practice";
import { classifyArousalState, selectEmotionRegulationSkill, recommendERNextSkills, erPracticeTask } from "./emotion-logic";
import { EmotionRegulationCoach } from "../agents/healing-emotion";
import { type EmotionRegulationInput, type EmotionRegulationOutput, type EmotionRegulationCore, EmotionRegulationCoreSchema } from "../domain/emotion-regulation";

export interface ERResult extends EmotionRegulationOutput {
  recordId: string;
}

export async function runEmotionRegulation(input: EmotionRegulationInput): Promise<ERResult> {
  const risk = input.safetyContext.riskLevel;
  if (risk === "red") throw new Error("Emotion regulation is routed to crisis response during red risk.");

  const arousal = classifyArousalState(input);
  const suggestedSkill = selectEmotionRegulationSkill({ emotions: input.emotions, urges: input.urges, currentEmotionText: input.currentEmotionText, arousal });

  let core: EmotionRegulationCore;
  try {
    core = await EmotionRegulationCoach.run({
      currentEmotionText: input.currentEmotionText,
      arousalGuess: arousal,
      suggestedSkill,
      emotions: input.emotions ?? [],
      urges: input.urges ?? [],
      language: "zh",
    });
  } catch (e) {
    reportError(e, { surface: "emotion-regulation", stage: "run" });
    core = EmotionRegulationCoreSchema.parse({
      emotionalStateMap: { dominantEmotions: [], arousalState: arousal, bodySignals: input.bodySignals ?? [], triggerSummary: "", immediateRiskNotes: [] },
      recommendedSkillSet: { primarySkill: suggestedSkill, reason: "先做一个温和的稳定化练习。", contraindications: [] },
      interventionPlan: { sixtySecondVersion: ["吸气 4 秒，停 4 秒，呼气 6 秒，重复 5 次"], fiveMinuteVersion: [], twentyMinuteVersion: [] },
      practiceTask: { title: "60 秒稳定化", steps: ["4-4-6 呼吸 ×5"], suggestedTiming: "情绪升高时", completionMetric: "完成后强度是否下降" },
      reflectionQuestions: [],
    });
  }

  const output: EmotionRegulationOutput = { ...core, nextRecommendedSkills: recommendERNextSkills(core, risk) };
  const recordId = await persist(input, output);
  if (recordId) await createPracticeTask(erPracticeTask(core, { userId: input.userId, sessionId: input.sessionId, sourceId: recordId }));
  return { ...output, recordId };
}

async function persist(input: EmotionRegulationInput, output: EmotionRegulationOutput): Promise<string> {
  try {
    const row = await prisma.emotionRegulationSession.create({
      data: {
        userId: input.userId,
        sessionId: input.sessionId,
        currentEmotionText: input.currentEmotionText,
        emotions: input.emotions ?? undefined,
        bodySignals: input.bodySignals ?? undefined,
        urges: input.urges ?? undefined,
        context: input.context ?? undefined,
        emotionalStateMap: output.emotionalStateMap,
        recommendedSkillSet: output.recommendedSkillSet,
        interventionPlan: output.interventionPlan,
        actProcess: output.actProcess ?? undefined,
        dbtProcess: output.dbtProcess ?? undefined,
        practiceTask: output.practiceTask,
        reflectionQuestions: output.reflectionQuestions,
        nextRecommendedSkills: output.nextRecommendedSkills,
      },
      select: { id: true },
    });
    await recordHealingEvent({
      userId: input.userId, sessionId: input.sessionId, module: "emotion-regulation", type: "EmotionRegulated", recordId: row.id,
      payload: { arousal: output.emotionalStateMap.arousalState, primarySkill: output.recommendedSkillSet.primarySkill },
    });
    return row.id;
  } catch (e) {
    reportError(e, { surface: "emotion-regulation", stage: "persist" });
    return "";
  }
}
