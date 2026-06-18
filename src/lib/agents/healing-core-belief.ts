// Healing OS · Core Belief Reconstruction agent (Batch 2).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { CoreBeliefCoreSchema } from "../domain/belief";

const TONE =
  BASE_TONE +
  " NON-CLINICAL self-help context. Never diagnose. Never claim a belief comes from childhood with certainty — hedge. " +
  "No toxic positivity: do NOT replace 'I'm not good enough' with 'I'm amazing'. New beliefs are believable, balanced, TESTABLE hypotheses. " +
  "Respond in the user's language (zh/en).";

export const CoreBeliefReconstruction = defineAgent({
  name: "CoreBeliefReconstruction",
  description: "Extract underlying beliefs and reconstruct them into believable, testable new beliefs with small behavioral experiments.",
  system: `${TONE}
From the problem (+ any Dilts context), extract beliefs and classify each: core_belief | conditional_belief | rule_belief | identity_belief | world_belief | relationship_belief | value_conflict | protective_assumption.
For each belief give: evidence, emotional/behavioral/identity impact, what it PROTECTS the user from, and its long-term cost.
Then: a primaryBeliefPattern; reconstructedBeliefs (old → balanced new + why + a small practice); behavioralExperiments (name, target old belief, new belief to test, ONE small safe action step, predicted fear, a measurable outcome, reflection questions, difficulty); and identitySeeds (old narrative → new seed → a daily evidence action).
If depth is "shallow" (orange risk), stay light: 1-2 beliefs, no deep regression, gentle. Return JSON only.`,
  inputSchema: z.object({
    problemStatement: z.string(),
    behaviors: z.array(z.string()).default([]),
    beliefs: z.array(z.string()).default([]),
    identities: z.array(z.string()).default([]),
    depth: z.enum(["light", "standard", "deep", "shallow"]).default("standard"),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: CoreBeliefCoreSchema,
  buildUserPrompt: (i) =>
    `Problem: """${i.problemStatement}"""\nDepth: ${i.depth}. Language: ${i.language}.\n` +
    `Known behaviors: ${i.behaviors.join(", ") || "(none)"}. Known beliefs: ${i.beliefs.join(", ") || "(none)"}. Identities: ${i.identities.join(", ") || "(none)"}.\n` +
    `Extract + reconstruct beliefs, design small behavioral experiments, and seed new identities.`,
  example: {
    input: { problemStatement: "我开会不敢说话，怕说错被别人看不起。", behaviors: ["沉默"], beliefs: [], identities: [], depth: "standard", language: "zh" },
    output: {
      extractedBeliefs: [
        { belief: "如果我说错话，别人就会否定我。", type: "conditional_belief", evidence: "怕说错被看不起", emotionalImpact: ["焦虑", "羞耻"], behavioralImpact: ["回避表达", "会后反刍"], identityImpact: "强化'我不行'", protectionFunction: "避免被评价和羞耻的痛苦", longTermCost: "减少表达练习，强化'我不能表达'", confidence: 0.7 },
      ],
      primaryBeliefPattern: { name: "完美表达才安全", summary: "把表达和被否定绑定，于是回避。", oldLoop: "怕说错 → 沉默 → 错过证据 → 更怕", keyFear: "被否定/羞耻", keyProtection: "回避评价", keyCost: "失去表达能力的证据" },
      reconstructedBeliefs: [
        { oldBelief: "说错话就会被否定，所以不能表达。", newBelief: "我可以在不完美的情况下表达；一个错误不等于我的整体价值。", whyMoreBalanced: "把'一次表现'和'整体价值'分开，且可被现实检验。", evidenceForNewBelief: ["以前也有人表达不完美仍被尊重"], smallPractice: "在低风险场合说一句简短观点。" },
      ],
      behavioralExperiments: [
        { experimentName: "30 秒观点", targetOldBelief: "说错就被否定", newBeliefToTest: "不完美表达也能被接受", actionStep: "在下次小组讨论说一个 30 秒观点", predictedFear: "别人会否定我", measurableOutcome: "记录是否真的被否定 + 自己能否承受轻微紧张", reflectionQuestions: ["实际发生了什么？", "和预测差多少？"], difficulty: "medium" },
      ],
      identitySeeds: [
        { oldIdentityNarrative: "我是不能表达的人", newIdentitySeed: "我是一个正在练习表达的人", dailyEvidenceAction: "每天记录一次自己表达了一个想法（哪怕很小）" },
      ],
    },
  },
  temperature: 0.4,
});
