// Healing OS · Parts Work (inner family) agent (Batch 3).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { PartsWorkCoreSchema, PARTS_MODES } from "../domain/parts-work";

const TONE =
  BASE_TONE +
  " NON-CLINICAL parts-work-STYLE self-awareness — NOT formal IFS therapy. Never diagnose. Never imply DID / multiple personality. Never excavate trauma memories. " +
  "No part is killed or suppressed: understand its protective intent first, then invite a more mature role. The Healthy Adult leads. Respond in the user's language.";

export const PartsWork = defineAgent({
  name: "PartsWork",
  description: "Map inner conflicting parts (critic, pleaser, avoider, wounded child, healthy adult…), their protective intent, and a Healthy Adult response.",
  system: `${TONE}
From the user's inner conflict, identify the parts in play. For each: partName, partType, its voice, emotion, urge, protectionGoal, the fear if it stopped protecting, the cost of its extreme strategy, and what it needs.
Then: internalConflictSummary (the pattern, which parts are polarized, their SHARED positive intention, the main risk); a healthyAdultResponse (stance + per-part validation/boundary/new-role invitation + an integrative statement); a short, non-dramatic innerDialogueScript; and a small practiceTask (5-10 min) WITH a safetyStopRule.
If mode is "light_parts_checkin" (orange risk), keep it very light — name 1-2 parts, validate, no deep work. Return JSON only.`,
  inputSchema: z.object({
    currentConflict: z.string(),
    mode: z.enum(PARTS_MODES).default("parts_mapping"),
    coreBeliefs: z.array(z.string()).default([]),
    behaviors: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: PartsWorkCoreSchema,
  buildUserPrompt: (i) =>
    `Inner conflict: """${i.currentConflict}"""\nMode: ${i.mode}. Language: ${i.language}.\nKnown beliefs: ${i.coreBeliefs.join(", ") || "(none)"}. Behaviors: ${i.behaviors.join(", ") || "(none)"}.\n` +
    `Map the parts, their protective intent, and a Healthy Adult response.`,
  example: {
    input: { currentConflict: "一部分我想努力完成项目，另一部分就是想逃避，刷手机。", mode: "parts_mapping", coreBeliefs: [], behaviors: ["拖延", "刷手机"], language: "zh" },
    output: {
      partsMap: [
        { partName: "拼命三郎", partType: "striving_part", voice: "必须现在做完，否则就完了", emotion: "焦虑", urge: "逼自己一次做完全部", protectionGoal: "避免失败和落后", fearIfNotProtected: "我会被淘汰", costOfExtremeStrategy: "把任务放大到无法开始", whatItNeeds: "被肯定努力，同时被允许分步" },
        { partName: "逃避者", partType: "avoider", voice: "太难了，先刷一会儿", emotion: "压力、疲惫", urge: "回避任务", protectionGoal: "避免被压垮的痛苦", fearIfNotProtected: "我会崩溃", costOfExtremeStrategy: "拖延后更自责", whatItNeeds: "把任务变小、可承受" },
      ],
      internalConflictSummary: { conflictPattern: "全有或全无的努力 vs 回避", polarizedParts: ["拼命三郎", "逃避者"], sharedPositiveIntention: "都想保护你不被失败和压垮", mainRisk: "两者拉扯导致拖延和自责循环" },
      healthyAdultResponse: {
        stance: "我看到你们都在努力保护我。",
        validationForEachPart: [
          { partName: "拼命三郎", validation: "谢谢你在乎我的表现。", boundary: "但我不需要一次做完全部。", newRoleInvitation: "帮我提醒优先级，而不是制造恐慌。" },
          { partName: "逃避者", validation: "谢谢你想保护我不被压垮。", boundary: "但长期回避会更难。", newRoleInvitation: "帮我把任务拆到 10 分钟可承受。" },
        ],
        integrativeStatement: "我可以用 10 分钟启动一个最小版本，既照顾努力，也照顾承受力。",
      },
      innerDialogueScript: [
        { speaker: "健康成人", line: "我们先做 10 分钟，只做最小的第一步，好吗？" },
        { speaker: "逃避者", line: "10 分钟我可以试试。" },
      ],
      practiceTask: { title: "内在协商 + 10 分钟启动", steps: ["分别谢谢两个部分", "把任务拆到 10 分钟", "设计时器做最小第一步"], duration: "10 分钟", safetyStopRule: "如果情绪被淹没就停下，做一次呼吸落地" },
    },
  },
  temperature: 0.45,
});
