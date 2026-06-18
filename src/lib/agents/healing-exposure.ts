// Healing OS · Avoidance & Exposure agent (Batch 3).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { ExposureCoreSchema, EXPOSURE_TYPES } from "../domain/exposure";

const TONE =
  BASE_TONE +
  " NON-CLINICAL self-help graded exposure for LOW-RISK avoidance only. NEVER design trauma exposure, dangerous real-world tasks, confronting an abuser, illegal acts, or OCD-ERP. " +
  "Never force escalation. The ladder is gradual; the FIRST experiment is easy/medium; auto-generated distress stays ≤ 7/10. Always define stop rules. Respond in the user's language.";

export const ExposureEngine = defineAgent({
  name: "ExposureEngine",
  description: "Map an avoidance loop and design a safe, graded exposure ladder + a small first behavioral experiment with prediction-vs-outcome tracking.",
  system: `${TONE}
From the avoidance problem: build the avoidanceLoop (trigger → fear prediction → emotion → avoidance behavior → safety behaviors → short-term relief → long-term cost).
Classify exposureType from [${EXPOSURE_TYPES.join(", ")}].
Build a gradual hierarchy of 5-8 levels (each: level, title, action, predictedDistress 0-7, difficulty, safetyNotes, successCriteria where success = approached/recorded, NOT zero anxiety).
Pick ONE selectedExperiment at easy/medium difficulty (old prediction, new learning target, small action steps, a safety behavior to reduce, duration, measurement {before/peak/after distress, actual outcome, learning statement}, stopRules).
Provide a reflectionTemplate (before/during/after questions). Return JSON only.`,
  inputSchema: z.object({
    avoidanceProblem: z.string(),
    fearPrediction: z.string().default(""),
    currentAvoidanceBehaviors: z.array(z.string()).default([]),
    safetyBehaviors: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: ExposureCoreSchema,
  buildUserPrompt: (i) =>
    `Avoidance problem: """${i.avoidanceProblem}"""\nFear prediction: ${i.fearPrediction || "(infer)"}. Avoidance behaviors: ${i.currentAvoidanceBehaviors.join(", ") || "(infer)"}. Safety behaviors: ${i.safetyBehaviors.join(", ") || "(infer)"}. Language: ${i.language}.\n` +
    `Map the loop and design a gradual, safe exposure ladder + a small first experiment.`,
  example: {
    input: { avoidanceProblem: "我开会不敢说话，怕别人觉得我很蠢。", fearPrediction: "", currentAvoidanceBehaviors: ["沉默"], safetyBehaviors: ["过度准备"], language: "zh" },
    output: {
      avoidanceLoop: { trigger: "会议、公开表达", fearPrediction: "我会说错，别人觉得我蠢", emotion: "焦虑、羞耻", avoidanceBehavior: "沉默、不发言", safetyBehaviors: ["过度准备", "只在私下说"], shortTermRelief: "立刻降低焦虑", longTermCost: "失去练习，强化'我不能表达'" },
      exposureType: "social_expression",
      hierarchy: [
        { level: 1, title: "写下观点", action: "会前写下一个观点，不发言", predictedDistress: 2, difficulty: "easy", safetyNotes: "无现实风险", successCriteria: "完成书写即成功" },
        { level: 2, title: "打字提问", action: "在聊天窗口发一个简短问题", predictedDistress: 3, difficulty: "easy", safetyNotes: "", successCriteria: "发出即成功" },
        { level: 3, title: "口头补充", action: "小组会议说一句补充", predictedDistress: 4, difficulty: "medium", safetyNotes: "", successCriteria: "说出即成功" },
        { level: 4, title: "澄清提问", action: "主动问一个澄清问题", predictedDistress: 5, difficulty: "medium", safetyNotes: "", successCriteria: "提问即成功" },
        { level: 5, title: "30 秒观点", action: "表达一个 30 秒观点", predictedDistress: 6, difficulty: "medium", safetyNotes: "", successCriteria: "表达即成功" },
        { level: 6, title: "表达不同意见", action: "提出一个不同意见并保持语气稳定", predictedDistress: 7, difficulty: "hard", safetyNotes: "可稍后再挑战", successCriteria: "表达即成功" },
      ],
      selectedExperiment: {
        title: "小组会议说一句补充",
        oldPrediction: "我会说错，别人觉得我蠢",
        newLearningTarget: "不完美的发言也能被接受；轻微紧张是可以承受的",
        actionSteps: ["选一个低风险的小组会议", "准备一句简短补充", "说出来并记录他人反应"],
        safetyBehaviorToReduce: "减少过度准备，只准备一句",
        duration: "一次会议",
        measurement: { beforeDistress: "发言前 0-10", peakDistress: "发言时最高 0-10", afterDistress: "发言后 0-10", actualOutcome: "别人是否真的否定我", learningStatement: "我学到的一句话" },
        stopRules: ["如果惊恐发作或感到不安全，先停下做呼吸落地"],
      },
      reflectionTemplate: { beforeQuestions: ["我预测会发生什么？", "我的恐惧 0-10？"], duringQuestions: ["此刻焦虑多高？", "我在用哪个安全行为？"], afterQuestions: ["实际发生了什么？", "和预测差多少？", "我学到了什么？"] },
    },
  },
  temperature: 0.4,
});
