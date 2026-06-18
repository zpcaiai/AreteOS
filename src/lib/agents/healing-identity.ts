// Healing OS · Identity Reconstruction & Mission Recovery agent (Batch 4).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { IdentityReconstructionCoreSchema, IDENTITY_MODES } from "../domain/identity-rebuild";

const TONE =
  BASE_TONE +
  " NON-CLINICAL. Never promise a cure, never deny past pain, never force a grandiose identity ('I'm destined to win'), no toxic positivity, no diagnosis. " +
  "Identity changes in steps: old narrative → believable transition identity → grounded new seed → daily evidence. New seeds must be evidence-based and practice-testable. Respond in the user's language.";

export const IdentityReconstruction = defineAgent({
  name: "IdentityReconstruction",
  description: "Move old identity narratives toward grounded, believable new identity seeds with a 7-day evidence plan and gentle mission recovery.",
  system: `${TONE}
From the identity pain: extract oldIdentityNarratives (narrative, evidence from the user's story, its protection function, long-term cost, linked beliefs/behaviors).
Build transitionIdentities (old → believable transition like "I am someone learning to recover from failure" — NOT "I'm a winner") with why it's believable + what it allows.
Build newIdentitySeeds (grounded in evidence, with required practices and a note on the risk of overstating).
missionRecovery: blocked themes, avoided roles, values to recover, relationship/work/service directions (no pressure). spiritualReflection only if enabled.
dailyEvidencePlan: an identityStatement + 7 daily evidence actions (each with an evidence question + difficulty) + a minimumViableAction + a fallbackAction for low-energy days.
A small identityPracticeTask + integrationSummary.
If mode is "light_identity_stabilization" (orange), keep it gentle: a steadying statement + one tiny action, no deep mission work. Return JSON only.`,
  inputSchema: z.object({
    currentIdentityPain: z.string(),
    mode: z.enum(IDENTITY_MODES).default("identity_mapping"),
    oldBeliefs: z.array(z.string()).default([]),
    successfulPracticeEvidence: z.array(z.string()).default([]),
    importantValues: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: IdentityReconstructionCoreSchema,
  buildUserPrompt: (i) =>
    `Identity pain: """${i.currentIdentityPain}"""\nMode: ${i.mode}. Language: ${i.language}.\nOld beliefs: ${i.oldBeliefs.join(", ") || "(none)"}. Evidence of progress: ${i.successfulPracticeEvidence.join(", ") || "(none)"}. Values: ${i.importantValues.join(", ") || "(none)"}.\n` +
    `Build transition identities, grounded seeds, a 7-day evidence plan, and gentle mission recovery.`,
  example: {
    input: { currentIdentityPain: "我总觉得自己是失败者，做什么都不够好。", mode: "identity_mapping", oldBeliefs: ["我不够好"], successfulPracticeEvidence: ["上周完成了 3 次练习"], importantValues: ["成长", "真实"], language: "zh" },
    output: {
      identityMap: {
        oldIdentityNarratives: [{ narrative: "我是失败者", evidenceFromUserStory: "做什么都不够好", protectionFunction: "降低期待以避免再次失望", longTermCost: "不敢尝试，证据越来越少", linkedBeliefs: ["我不够好"], linkedBehaviors: ["回避", "自我批评"] }],
        transitionIdentities: [{ oldNarrative: "我是失败者", transitionIdentity: "我是一个正在学习从失败中恢复的人", whyThisIsBelievable: "你已经在尝试，并完成了一些练习", whatItAllowsUserToDo: "允许自己不完美地继续行动" }],
        newIdentitySeeds: [{ identitySeed: "我是一个可以通过小行动积累能力和信心的人", groundedEvidence: ["上周完成了 3 次练习"], requiredPractices: ["每天一个 20 分钟小任务"], riskOfOverstatement: "不要跳成'我一定成功'，保持可验证" }],
      },
      missionRecovery: { blockedMissionThemes: ["不敢承担创造性责任"], avoidedRoles: ["带头表达的人"], valuesToRecover: ["成长", "真实"], relationshipDirection: "在关系中更真实地表达需要", workOrCreationDirection: "用小项目重建能力感", serviceOrContributionDirection: "把学到的分享给一个人" },
      dailyEvidencePlan: {
        identityStatement: "我是一个可以通过小行动积累能力的人",
        sevenDayEvidenceActions: [
          { day: 1, action: "完成一个 20 分钟任务并记录", evidenceQuestion: "我今天做了什么真实的进展？", difficulty: "easy" },
          { day: 2, action: "对一个小请求温和地说一次'不'", evidenceQuestion: "我有没有照顾自己的需要？", difficulty: "medium" },
          { day: 3, action: "记录一个我做得还可以的地方", evidenceQuestion: "我忽略了哪些积极证据？", difficulty: "easy" },
          { day: 4, action: "做一个不完美初稿", evidenceQuestion: "不完美开始带来了什么？", difficulty: "medium" },
          { day: 5, action: "联系一个支持我的人", evidenceQuestion: "连接如何影响我的状态？", difficulty: "easy" },
          { day: 6, action: "表达一个小观点", evidenceQuestion: "表达后实际发生了什么？", difficulty: "medium" },
          { day: 7, action: "回顾一周证据", evidenceQuestion: "我看到自己在成为谁？", difficulty: "easy" },
        ],
        minimumViableAction: "记录今天一个微小的真实进展",
        fallbackAction: "低能量时，只需写一句'我今天照顾了自己'",
      },
      identityPracticeTask: { title: "7 天身份证据", description: "每天完成一个身份证据行动并记录", steps: ["选当天行动", "完成", "回答证据问题"], completionMetric: "记录的证据数量" },
      integrationSummary: "你不必从'失败者'一步跳到'天选者'。先成为'正在恢复的人'，用每天的小证据，让'我能积累能力'这个身份逐渐有据可依。",
    },
  },
  temperature: 0.5,
});
