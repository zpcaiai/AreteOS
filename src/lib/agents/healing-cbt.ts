// Healing OS · CBT Behavioral Change agent (Batch 2).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { CBTCoreSchema, CBT_MODES } from "../domain/cbt";

const TONE =
  BASE_TONE +
  " NON-CLINICAL self-help. Never diagnose. Do not claim thoughts alone cause all suffering; do not invalidate emotions; no toxic positivity. " +
  "Alternative thoughts are believable and testable. Behavior plans are small, concrete, measurable, safe. Respond in the user's language.";

export const CBTBehavioralChange = defineAgent({
  name: "CBTBehavioralChange",
  description: "Map a situation through the CBT model, name distortions, check evidence, generate believable alternatives + a small behavior plan.",
  system: `${TONE}
Map the situation into: automatic thoughts (+ the emotions each triggers), emotions (name/intensity/function), behaviors (short-term reward + long-term cost), and the outcome loop.
Detect cognitive distortions from this set: catastrophizing, mind_reading, all_or_nothing, overgeneralization, emotional_reasoning, should_statements, labeling, personalization, discounting_positive, fortune_telling, mental_filter — each with evidence + a Socratic reframe question.
Do an evidence check (for / against / missing info / more balanced view). Give alternativeThoughts (old → believable alternative + a practice prompt). Give ONE behaviorPlan tuned to the mode (thought_record/cognitive_reframe/behavioral_experiment/behavioral_activation/procrastination_breakdown/rumination_interrupt): title, small steps, difficulty, expected obstacle, coping plan, measurement. For procrastination → a 10-20 min low-bar starter. For rumination → distinguish problem-solving vs rumination, postpone-worry, pivot to a body/environment action. Return JSON only.`,
  inputSchema: z.object({
    situation: z.string(),
    mode: z.enum(CBT_MODES).default("thought_record"),
    emotions: z.array(z.object({ name: z.string(), intensity: z.number() })).default([]),
    urges: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: CBTCoreSchema,
  buildUserPrompt: (i) =>
    `Situation: """${i.situation}"""\nMode: ${i.mode}. Language: ${i.language}.\n` +
    `Reported emotions: ${i.emotions.map((e) => `${e.name}(${e.intensity})`).join(", ") || "(infer)"}. Urges: ${i.urges.join(", ") || "(none)"}.\n` +
    `Produce the CBT map, distortions, evidence check, alternatives, and one small behavior plan.`,
  example: {
    input: { situation: "老板刚才没回我消息，我觉得他肯定对我不满意，我可能要被开除了。", mode: "cognitive_reframe", emotions: [{ name: "焦虑", intensity: 7 }], urges: [], language: "zh" },
    output: {
      cbtMap: {
        situation: "老板没回消息",
        automaticThoughts: [{ thought: "他对我不满意，我要被开除了", emotionTriggered: ["焦虑", "恐惧"], confidence: 0.6 }],
        emotions: [{ name: "焦虑", intensity: 7, function: "提醒潜在风险，要求确定感" }],
        behaviors: [{ behavior: "反复查看手机、脑补最坏结果", shortTermReward: "感觉在'掌控'", longTermCost: "焦虑被放大，无法专注" }],
        outcomeLoop: "没回消息 → 灾难化 → 反复查看 → 更焦虑",
      },
      cognitiveDistortions: [
        { distortion: "mind_reading", evidence: "'他肯定对我不满意'", reframeQuestion: "我有什么证据证明他真的不满意？" },
        { distortion: "catastrophizing", evidence: "'我可能要被开除了'", reframeQuestion: "最坏结果的概率有多大？更可能的解释是什么？" },
        { distortion: "fortune_telling", evidence: "提前断定被开除", reframeQuestion: "我是在预测还是在基于证据判断？" },
      ],
      evidenceCheck: {
        evidenceFor: ["他这次没回消息"],
        evidenceAgainst: ["他常常忙时延迟回复", "上周还把新项目交给我"],
        missingInformation: ["他现在是否在开会/忙碌"],
        moreBalancedView: "没回消息可能有很多原因；我目前没有足够证据证明他不满意。",
      },
      alternativeThoughts: [{ oldThought: "他不满意，我要被开除", alternativeThought: "他没回可能只是忙；等合理时间后我可以简短跟进。", practicePrompt: "把这句话写下来，焦虑升高时读一遍。" }],
      behaviorPlan: { planType: "behavioral_experiment", title: "等待后简短跟进", steps: ["等 2 小时", "用一句话清晰跟进", "记录他的实际回应"], difficulty: "easy", expectedObstacle: "想立刻反复发消息", copingPlan: "先做 4-6 呼吸，把冲动延后", measurement: "是否在 2 小时后才跟进 + 实际回应如何" },
      reflectionQuestions: ["实际结果和我的预测差多少？", "下次我能更快想到哪条反证？"],
    },
  },
  temperature: 0.35,
});
