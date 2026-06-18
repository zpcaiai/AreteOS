// Healing OS · Emotion Regulation (DBT/ACT) agent (Batch 2).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { EmotionRegulationCoreSchema, AROUSAL_STATES, ER_SKILLS } from "../domain/emotion-regulation";

const TONE =
  BASE_TONE +
  " NON-CLINICAL self-help. The goal is NOT to erase emotion but: identify → stabilize body → understand function → lower impulse → choose a value-consistent micro-action. " +
  "Never diagnose, never invalidate the emotion, no toxic positivity, no trauma exposure. Respond in the user's language.";

export const EmotionRegulationCoach = defineAgent({
  name: "EmotionRegulationCoach",
  description: "Regulate acute emotional distress with DBT/ACT/grounding: arousal-aware skill + 60s/5m/20m plans + validation + a values micro-action.",
  system: `${TONE}
Given the user's emotion text (+ deterministic arousal guess + suggested skill), produce:
- emotionalStateMap: dominantEmotions (name/intensity/likelyFunction/associatedUrge), arousalState, bodySignals, triggerSummary, immediateRiskNotes.
- recommendedSkillSet: a primarySkill from [${ER_SKILLS.join(", ")}], a reason, contraindications.
- interventionPlan: a 60-second, 5-minute, and 20-minute version (concrete steps).
- dbtProcess (validationStatement + emotion + a check-the-facts question + optional opposite-action / distress-tolerance step) when DBT-relevant.
- actProcess (a defusion phrase + accepted experience + chosen value + ONE committed micro-action) when ACT-relevant.
- a small practiceTask + reflectionQuestions.
Always include validation. Honor the arousal guess unless clearly wrong. Return JSON only.`,
  inputSchema: z.object({
    currentEmotionText: z.string(),
    arousalGuess: z.enum(AROUSAL_STATES).default("unclear"),
    suggestedSkill: z.enum(ER_SKILLS).default("grounding_5_4_3_2_1"),
    emotions: z.array(z.object({ name: z.string(), intensity: z.number() })).default([]),
    urges: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: EmotionRegulationCoreSchema,
  buildUserPrompt: (i) =>
    `Emotion: """${i.currentEmotionText}"""\nArousal guess: ${i.arousalGuess}. Suggested skill: ${i.suggestedSkill}. Language: ${i.language}.\n` +
    `Reported emotions: ${i.emotions.map((e) => `${e.name}(${e.intensity})`).join(", ") || "(infer)"}. Urges: ${i.urges.join(", ") || "(none)"}.\n` +
    `Produce the state map, skill, 60s/5m/20m plans, validation, and a values micro-action.`,
  example: {
    input: { currentEmotionText: "我现在很焦虑，心跳很快，脑子停不下来。", arousalGuess: "hyperarousal", suggestedSkill: "paced_breathing", emotions: [{ name: "焦虑", intensity: 8 }], urges: [], language: "zh" },
    output: {
      emotionalStateMap: {
        dominantEmotions: [{ name: "焦虑", intensity: 8, likelyFunction: "提醒风险，要求准备或确定感", associatedUrge: "想逃离/反复思考" }],
        arousalState: "hyperarousal",
        bodySignals: ["心跳快", "脑子停不下来"],
        triggerSummary: "高唤醒的焦虑，身体被激活",
        immediateRiskNotes: [],
      },
      recommendedSkillSet: { primarySkill: "paced_breathing", reason: "高唤醒时，先用延长呼气把神经系统降下来。", contraindications: ["如有呼吸系统不适请放慢"] },
      interventionPlan: {
        sixtySecondVersion: ["吸气 4 秒，停 4 秒，呼气 6 秒，重复 5 次", "说出你看到的 3 个物体"],
        fiveMinuteVersion: ["继续延长呼气 2 分钟", "5-4-3-2-1 落地", "喝一口水，脚踩地"],
        twentyMinuteVersion: ["呼吸 + 落地", "写下此刻最具体的一个担忧", "做一个 10 分钟的小行动转移注意"],
      },
      dbtProcess: { validationStatement: "你现在焦虑是有原因的，身体在试图保护你。", emotionName: "焦虑", factCheckQuestion: "此刻真实发生的事实是什么？我又添加了哪些解释？", distressToleranceStep: "先用呼吸活过这一波，再决定下一步。" },
      actProcess: { painfulThoughtOrFeeling: "脑子停不下来的焦虑", defusionPhrase: "我注意到，我的大脑正在产生很多担忧的想法。", acceptedExperience: "我允许焦虑在这里几分钟，同时做一个小动作。", chosenValue: "稳定地照顾自己", committedMicroAction: "做 5 次延长呼气，然后喝一口水。" },
      practiceTask: { title: "高唤醒呼吸落地", steps: ["4-4-6 呼吸 ×5", "5-4-3-2-1 落地"], suggestedTiming: "焦虑升高时", completionMetric: "完成后焦虑是否下降 1-2 分" },
      reflectionQuestions: ["做完后身体有什么变化？", "下次更早察觉到哪一个早期信号？"],
    },
  },
  temperature: 0.4,
});
