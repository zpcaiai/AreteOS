// Healing OS · Journey Timeline narrative agent (Batch 4). Metrics are computed
// deterministically; this only writes the (non-exaggerated) narrative.
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { TimelineNarrativeSchema } from "../domain/timeline";

const TONE =
  BASE_TONE +
  " NON-CLINICAL. Summarize progress WITHOUT exaggeration. Never claim a cure, never diagnose. If data is thin, say so plainly. When risk is rising, recommend safety/stabilization, NOT deep work. Respond in the user's language.";

export const HealingTimelineNarrator = defineAgent({
  name: "HealingTimelineNarrator",
  description: "Write an honest weekly progress report from pre-computed healing metrics + event summary.",
  system: `${TONE}
You receive computed metrics (practice completion, exposure/identity-evidence counts, risk trend, overall direction) + an event summary + deterministic stuck-point hints.
Write: summaryText; patternChanges (old vs current expression + evidence + remaining challenge); growthEvidence (concrete, sourced, with identity meaning); stuckPoints (refine the hints); nextStepRecommendations (prioritized, each with a related skill + reason); and a warm userFacingWeeklyReport.
Do not invent progress the metrics don't support. If overall direction is insufficient_data, say so. Return JSON only.`,
  inputSchema: z.object({
    overallDirection: z.string(),
    metricsSummary: z.string(),
    eventSummary: z.string(),
    stuckHints: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: TimelineNarrativeSchema,
  buildUserPrompt: (i) =>
    `Overall direction: ${i.overallDirection}.\nMetrics: ${i.metricsSummary}\nEvents: ${i.eventSummary}\nStuck-point hints: ${i.stuckHints.join("; ") || "(none)"}. Language: ${i.language}.\n` +
    `Write the honest progress report.`,
  example: {
    input: { overallDirection: "improving", metricsSummary: "练习完成率 0.71（5/7），暴露完成 2，身份证据 4，风险趋势 improving", eventSummary: "intake×1, dilts×1, cbt×2, exposure-attempt×2, identity-evidence×4", stuckHints: [], language: "zh" },
    output: {
      summaryText: "这一周你保持了较高的练习完成率，并开始把表达练习付诸行动，风险水平稳定下降。",
      patternChanges: [{ patternName: "会议回避", previousExpression: "会议场景 → 沉默 → 会后自责", currentExpression: "会议场景 → 焦虑仍在 → 发了简短问题 → 记录结果", evidenceOfChange: ["2 次暴露尝试", "4 条身份证据"], remainingChallenge: "在更高难度的表达上仍会回避" }],
      growthEvidence: [{ evidence: "完成 5/7 个练习", source: "practice", identityMeaning: "我是一个可以通过小行动积累能力的人" }],
      stuckPoints: [],
      nextStepRecommendations: [{ priority: 1, recommendation: "把暴露阶梯推进到下一级", relatedSkill: "exposure", reason: "你已经成功完成低级别，可以小步上升" }],
      userFacingWeeklyReport: "这一周，你不是在原地打转——你开始把'表达'从想法变成行动，并留下了证据。下一步，我们可以把阶梯小小地往上推一级。",
    },
  },
  temperature: 0.5,
});
