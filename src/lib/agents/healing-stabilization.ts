// Healing OS · Trauma-Informed Stabilization agent (Batch 3).
import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { TraumaStabilizationCoreSchema, PRESENT_ORIENTATION, STABILIZATION_PRIORITIES, STABILIZATION_MODES } from "../domain/trauma-stabilization";
import { AROUSAL_STATES } from "../domain/emotion-regulation";

const TONE =
  BASE_TONE +
  " Your job is STABILIZATION, not trauma processing. NEVER ask for trauma details. NEVER do exposure, EMDR, or memory regression. NEVER diagnose PTSD. " +
  "Support safety, choice, collaboration, and empowerment (SAMHSA). Keep steps few and simple. Respond in the user's language.";

export const TraumaStabilization = defineAgent({
  name: "TraumaStabilization",
  description: "Stabilize acute trauma activation (flashback / panic / dissociation / numbness) and return the user to the present. No trauma detail.",
  system: `${TONE}
You receive ONLY the current state (symptoms, body signals, orientation) + a deterministic arousal/priority/protocol guess. Do not ask what happened.
Produce: stabilizationAssessment (arousalState, presentOrientation, stabilizationPriority, doNotProceedWith); a brief userFacingValidation; an immediateProtocol (title, duration, few steps, stopSignals — when to stop and get human support); a groundingPlan (sensory/body/environment/phrase anchors).
If flashback signals → include flashbackPlan (recognition + a now-vs-then statement + orienting + aftercare). If dissociation/hypoarousal → include dissociationPlan (signs + reorientation + gentle body activation). If isolated/unsafe → include supportPlan (a support action + a low-burden message template + a note to seek professional help).
Return JSON only.`,
  inputSchema: z.object({
    currentExperience: z.string(),
    arousalGuess: z.enum(AROUSAL_STATES).default("unclear"),
    orientationGuess: z.enum(PRESENT_ORIENTATION).default("unclear"),
    priorityGuess: z.enum(STABILIZATION_PRIORITIES).default("grounding"),
    protocolGuess: z.enum(STABILIZATION_MODES).default("grounding"),
    symptoms: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: TraumaStabilizationCoreSchema,
  buildUserPrompt: (i) =>
    `Current state: """${i.currentExperience}"""\nArousal: ${i.arousalGuess}. Orientation: ${i.orientationGuess}. Priority: ${i.priorityGuess}. Protocol: ${i.protocolGuess}. Symptoms: ${i.symptoms.join(", ") || "(none)"}. Language: ${i.language}.\n` +
    `Stabilize and return to the present. Do NOT ask for trauma details.`,
  example: {
    input: { currentExperience: "我突然感觉像又回到了那个时候，心跳很快，很害怕。", arousalGuess: "hyperarousal", orientationGuess: "partially_oriented", priorityGuess: "orienting", protocolGuess: "flashback_protocol", symptoms: ["flashback", "panic"], language: "zh" },
    output: {
      stabilizationAssessment: { arousalState: "hyperarousal", presentOrientation: "partially_oriented", stabilizationPriority: "orienting", doNotProceedWith: ["回忆细节", "深入分析"] },
      userFacingValidation: "你现在的反应是身体在试图保护你。过去的事不是此刻正在发生，我们一起回到当下。",
      immediateProtocol: { title: "回到当下", duration: "1-2 分钟", steps: ["感受双脚踩在地面", "说出现在的日期和你所在的地点", "看向窗外/房间，说出 5 个你看到的东西"], stopSignals: ["如果感到无法控制或有伤害自己的冲动，请联系危机热线或身边可信的人"] },
      groundingPlan: { sensoryAnchors: ["握住一个凉的杯子", "听房间里的声音"], bodyAnchors: ["双脚踩地", "手按在大腿上"], environmentAnchors: ["说出墙的颜色", "找到门的位置"], phraseAnchors: ["现在是安全的当下", "我已经长大，能照顾自己"] },
      flashbackPlan: { recognitionStatement: "我注意到我的身体进入了过去的警报。", nowVsThenStatement: "那是过去；现在我在这里，今天是今天。", orientingSteps: ["说出今天日期", "说出当前地点", "做一个安全动作"], aftercareSteps: ["喝点水", "温和活动身体", "联系一个安全的人"] },
    },
  },
  temperature: 0.3,
});
