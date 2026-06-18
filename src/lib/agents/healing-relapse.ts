// Healing OS · Relapse Prevention & Maintenance agent (Batch 4).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { RelapsePreventionCoreSchema, RELAPSE_MODES } from "../domain/relapse-prevention";

const TONE =
  BASE_TONE +
  " NON-CLINICAL. Treat relapse as a SIGNAL to start a maintenance protocol, NOT a failure. Never use shame-based language ('you failed again'). Never claim a permanent cure. No diagnosis. " +
  "When risk is elevated, prioritize safety/stabilization over deep work. Respond in the user's language.";

export const RelapsePrevention = defineAgent({
  name: "RelapsePrevention",
  description: "Build early-warning signals, if-then plans, 24h/7d/30d recovery protocols, support + identity maintenance — relapse as signal, not failure.",
  system: `${TONE}
You receive the user's known patterns + recent signals + a deterministic relapse-risk band.
Produce: relapseRiskMap (riskLevel low/moderate/high/urgent, mainTriggers, earlyWarningSignals [signal/meaning/recommendedResponse], oldPatternScripts [pattern → sequence → interruptionPoint]).
ifThenPlans (if signal → then concrete action + related skill + difficulty).
recoveryProtocol (24-hour, 7-day, 30-day plans).
supportSystemPlan (self-support, a safe-people prompt, professional-support note, message templates).
identityMaintenance (old-identity warning, new-identity reminder, minimum evidence action, a non-shaming repair statement).
practiceMaintenancePlan (minimum daily practice, weekly review questions, low-energy fallback).
relapseReviewTemplate (what happened / triggered / old pattern / what helped even a little / what to try next time).
Reframe everything as "an old pattern got triggered — time to run the maintenance protocol". Return JSON only.`,
  inputSchema: z.object({
    currentConcern: z.string().default(""),
    mode: z.enum(RELAPSE_MODES).default("create_plan"),
    relapseRisk: z.enum(["low", "moderate", "high", "urgent"]).default("low"),
    activeSignals: z.array(z.string()).default([]),
    oldLoops: z.array(z.string()).default([]),
    coreBeliefs: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: RelapsePreventionCoreSchema,
  buildUserPrompt: (i) =>
    `Concern: """${i.currentConcern || "(general maintenance)"}"""\nMode: ${i.mode}. Relapse risk: ${i.relapseRisk}. Active signals: ${i.activeSignals.join(", ") || "(none)"}. Old loops: ${i.oldLoops.join(", ") || "(none)"}. Beliefs: ${i.coreBeliefs.join(", ") || "(none)"}. Language: ${i.language}.\n` +
    `Build the relapse-prevention + maintenance plan. Frame relapse as a signal, not failure.`,
  example: {
    input: { currentConcern: "我最近又开始拖延，连续几天没做练习。", mode: "early_warning_check", relapseRisk: "moderate", activeSignals: ["practiceStopped", "avoidanceIncreased"], oldLoops: ["焦虑-回避"], coreBeliefs: ["不完美就没价值"], language: "zh" },
    output: {
      relapseRiskMap: {
        riskLevel: "moderate",
        mainTriggers: ["任务压力", "完美主义"],
        earlyWarningSignals: [
          { signal: "连续几天没做练习", meaning: "回避模式被触发，不是你又失败了", recommendedResponse: "启动 5 分钟最低版本任务" },
          { signal: "开始回避任务", meaning: "焦虑在升高", recommendedResponse: "先做一次呼吸落地，再做最小一步" },
        ],
        oldPatternScripts: [{ patternName: "焦虑-回避", sequence: ["任务压力", "怕做不好", "回避", "短期缓解", "更焦虑"], interruptionPoint: "在'回避'之前插入 10 分钟最低任务" }],
      },
      ifThenPlans: [
        { ifSignal: "连续两天没做练习", thenAction: "执行最低 5 分钟版本任务，不做身份评判", relatedSkill: "cbt", difficulty: "easy" },
        { ifSignal: "开始想'我又不行了'", thenAction: "打开身份证据，写一条反证并做一个最小身份行动", relatedSkill: "identity-evidence", difficulty: "easy" },
      ],
      recoveryProtocol: {
        twentyFourHourPlan: ["暂停深度分析", "优先睡眠/饮食/水", "做一个 grounding", "做一个最低行动", "联系一个安全的人"],
        sevenDayPlan: ["Day1 稳定身体", "Day2 一次 CBT thought record", "Day3 完成一个最低练习", "Day4 联系支持", "Day5 记录一条身份证据", "Day6 一次轻量边界表达", "Day7 复盘如何更快回到轨道"],
        thirtyDayMaintenancePlan: ["每周 1 次 timeline 回顾", "每周 2-3 次练习", "每周 1 条身份证据", "每月更新预警信号"],
      },
      supportSystemPlan: { selfSupportActions: ["呼吸落地", "最小行动"], safePeopleToContactPrompt: "想想一个你信任、可以发一句低负担消息的人", professionalSupportRecommendation: "如果持续两周无改善或风险升高，考虑寻求专业支持", messageTemplates: [{ situation: "需要陪伴", message: "我最近状态不太好，能不能稍微陪我聊几句？" }] },
      identityMaintenance: { oldIdentityWarning: "'我又失败了'是旧身份在回来", newIdentityReminder: "我是一个可以更快回到轨道的人", minimumEvidenceAction: "今天做一个 5 分钟最小任务并记录", repairStatement: "旧模式被触发不是失败，重点是缩短回到轨道的时间" },
      practiceMaintenancePlan: { minimumDailyPractice: "每天一个 5 分钟最小任务", weeklyReviewQuestions: ["这周哪个信号最早出现？", "我用哪个 if-then 最有效？"], fallbackWhenLowEnergy: "只需写一句'我注意到了信号'" },
      relapseReviewTemplate: { whatHappened: "连续几天没做练习", whatTriggeredIt: "任务压力 + 完美主义", whatOldPatternAppeared: "焦虑-回避", whatHelpedEvenALittle: "做了一次 5 分钟任务", whatToTryNextTime: "更早启动最低版本" },
    },
  },
  temperature: 0.45,
});
