// ───────────────────────── Healing OS agents (Batch 1) ─────────────────────────
// LLM agents for the safety gate, the mental-state intake, and the Dilts/5P
// formulation. They emit the SEMANTIC core only; deterministic guarantees
// (risk overrides, route/skill policy, causal-loop ≥3 edges, ordered path,
// required protective factors) are added by the pure logic in src/lib/healing/*.
// Auto-exposed at POST /api/agents/:name via the registry, and called by the
// healing services. Mock provider → the example output, so the flow runs offline.

import { z } from "zod";
import { defineAgent } from "../ai/agent";
import { BASE_TONE } from "./_shared";
import { RISK_LEVELS, RISK_DOMAINS } from "../domain/risk";
import { MentalStateIntakeOutputSchema } from "../domain/mental-state";
import { DiltsCoreSchema } from "../domain/dilts";

const HEALING_TONE =
  BASE_TONE +
  " You operate inside a NON-CLINICAL self-help context. Never diagnose, never name a disorder, never claim to treat or cure. " +
  "Frame patterns as changeable tendencies and capability gaps as trainable skills, not fixed defects. " +
  "Hedge inferred history ('this may reflect…'), never assert childhood causes. Respond in the user's language (zh or en).";

/* ─────────────── HEAL-1 · SafetyTriageClassifier ─────────────── */
// Classifies risk ONLY. The deterministic rule engine can escalate this but
// never the reverse; the model can never *lower* a rule-determined risk.
export const SafetyTriageClassifier = defineAgent({
  name: "SafetyTriageClassifier",
  description: "Classify a message's acute mental-health risk (level + domains + signals). Not therapy, not diagnosis.",
  system: `${HEALING_TONE}
You are a safety-triage classifier for a self-help app. Your ONLY job is to detect whether the message indicates acute risk — you do not provide therapy or diagnosis.
Classify riskLevel:
- red: explicit suicidal intent with plan/means/timeframe or inability to stay safe; active self-harm; imminent harm to others; psychosis with danger; medical emergency.
- orange: suicidal thoughts without plan/intent; severe panic; marked dissociation; suspected mania; severe flashback; domestic-violence risk.
- yellow: severe distress but no acute danger.
- green: ordinary emotional distress, no danger.
Pick riskDomains from the allowed set; use ["none"] only when green with no domain.
detectedSignals: cite the exact words that drove your judgment.
supportiveMessage: ONE warm, non-clinical sentence in the user's language — used only when green/yellow (ignored otherwise). Do NOT give therapy or crisis instructions here.
Be conservative: when unsure between two levels, choose the higher. Return structured JSON only.`,
  inputSchema: z.object({
    message: z.string(),
    previousRiskLevel: z.enum(RISK_LEVELS).optional(),
    recentMoodScore: z.number().optional(),
    keywordSignals: z.array(z.string()).default([]),
  }),
  outputSchema: z.object({
    riskLevel: z.enum(RISK_LEVELS),
    riskDomains: z.array(z.enum(RISK_DOMAINS)).min(1),
    confidence: z.number().min(0).max(1),
    detectedSignals: z.array(z.object({ signal: z.string(), evidence: z.string(), severity: z.enum(["low", "medium", "high"]) })).default([]),
    supportiveMessage: z.string().default(""),
  }),
  buildUserPrompt: (i) =>
    `Message: """${i.message}"""\n` +
    `Prior risk level: ${i.previousRiskLevel ?? "(none)"}. Recent mood (0-10): ${i.recentMoodScore ?? "(n/a)"}.\n` +
    `Deterministic keyword pre-screen already flagged: ${i.keywordSignals.length ? i.keywordSignals.join(", ") : "(nothing)"}.\n` +
    `Classify risk. If green/yellow, add one supportive sentence in the user's language.`,
  example: {
    input: { message: "我最近很痛苦，睡不好，觉得自己很失败。", keywordSignals: [] },
    output: {
      riskLevel: "yellow",
      riskDomains: ["none"],
      confidence: 0.78,
      detectedSignals: [{ signal: "distress", evidence: "很痛苦, 觉得自己很失败", severity: "medium" }],
      supportiveMessage: "看起来你正承受很大的压力，我们可以慢慢把它拆小一点，一步步来。",
    },
  },
  temperature: 0.1,
});

/* ─────────────── HEAL-2 · MentalStateIntake ─────────────── */
export const MentalStateIntake = defineAgent({
  name: "MentalStateIntake",
  description: "Summarize the user's current psychological state into a structured, non-diagnostic snapshot.",
  system: `${HEALING_TONE}
You are a structured mental-state intake engine. You do not diagnose or label the user with a disorder.
From free text + ratings + checkboxes (and a safety result), summarize: a short non-pathologizing summary, primaryConcerns (with evidence in the user's own words), an emotionalProfile, functionalImpact (none/mild/moderate/severe per area), and likelyMaintainingLoops (the short-term reward + long-term cost that keeps each loop running).
Use the user's own words where possible. Do not over-pathologize or claim more than the input supports. Return structured JSON only.`,
  inputSchema: z.object({
    freeText: z.string().default(""),
    ratings: z.record(z.number()).default({}),
    checkboxes: z.record(z.boolean()).default({}),
    riskLevel: z.enum(RISK_LEVELS).default("green"),
    detectedLoopHints: z.array(z.string()).default([]),
  }),
  outputSchema: MentalStateIntakeOutputSchema,
  buildUserPrompt: (i) =>
    `Free text: """${i.freeText || "(none)"}"""\n` +
    `Ratings (0-10): ${JSON.stringify(i.ratings)}\nCheckboxes: ${JSON.stringify(i.checkboxes)}\n` +
    `Safety level: ${i.riskLevel}. Deterministic loop hints: ${i.detectedLoopHints.join(", ") || "(none)"}.\n` +
    `Produce the structured snapshot. suggestedNextSkills will be overwritten by the system — focus on summary, concerns, emotionalProfile, functionalImpact, and maintaining loops.`,
  example: {
    input: { freeText: "我最近很焦虑，总是拖延，晚上睡不好。", ratings: { anxiety: 7, sleepQuality: 3 }, checkboxes: { procrastination: true, sleepProblem: true }, riskLevel: "green", detectedLoopHints: ["perfectionism_procrastination"] },
    output: {
      summary: "你最近被焦虑和拖延困扰，睡眠也受到影响。这是压力下常见的相互放大的循环，而不是你能力或价值的问题。",
      primaryConcerns: [
        { concern: "焦虑", severity: "medium", evidence: "最近很焦虑" },
        { concern: "拖延", severity: "medium", evidence: "总是拖延" },
        { concern: "睡眠困难", severity: "medium", evidence: "晚上睡不好" },
      ],
      emotionalProfile: { dominantEmotions: ["焦虑", "自我怀疑"], intensityPattern: "傍晚和睡前升高", bodySignals: ["入睡困难", "紧绷"] },
      functionalImpact: { workOrStudy: "moderate", relationships: "mild", selfCare: "mild", sleep: "moderate" },
      likelyMaintainingLoops: [
        { loopName: "完美主义-拖延", kind: "perfectionism_procrastination", description: "必须做好 → 害怕开始 → 拖延 → 自责 → 更怕开始", shortTermReward: "暂时避免失败风险", longTermCost: "任务堆积、自责加重" },
      ],
      suggestedNextSkills: ["dilts-map", "case-formulation", "cbt"],
    },
  },
  temperature: 0.3,
});

/* ─────────────── HEAL-3 · DiltsFormulation ─────────────── */
export const DiltsFormulation = defineAgent({
  name: "DiltsFormulation",
  description: "Map a problem onto Dilts' six logical levels + a 5P case formulation. Non-diagnostic.",
  system: `${HEALING_TONE}
You are the Dilts Clinical Formulation Engine. Map the user's problem onto Dilts' six logical levels and a 5P case formulation.
- environment: external scenes, people, pressures (with evidence).
- behavior: what they do/avoid/repeat — each with shortTermFunction and longTermCost.
- capability: gaps framed as TRAINABLE skills (currentGap + trainableSkill), never defects.
- beliefAndValues: classify each as core_belief | conditional_belief | rule | value_conflict | assumption; give evidence + impact; hedge any possibleOrigin.
- identity: the narrative, its cost, and an alternativeIdentitySeed.
- mission: a blockedCalling, the fear, and a growthDirection.
5P: presentingProblems, predisposingFactors (cautious language), precipitatingFactors, perpetuatingFactors, protectiveFactors (ALWAYS surface at least one resource).
If depth is "shallow" (orange risk), keep it light and stabilization-oriented — few items, no deep regression. Do not diagnose. Return structured JSON only (diltsMap, fiveP, formulationSummary). The causal loop and intervention path are added by the system.`,
  inputSchema: z.object({
    problemStatement: z.string(),
    depth: z.enum(["light", "standard", "deep", "shallow"]).default("standard"),
    primaryConcerns: z.array(z.string()).default([]),
    dominantEmotions: z.array(z.string()).default([]),
    maintainingLoops: z.array(z.string()).default([]),
    language: z.enum(["zh", "en"]).default("zh"),
  }),
  outputSchema: DiltsCoreSchema,
  buildUserPrompt: (i) =>
    `Problem: """${i.problemStatement}"""\nDepth: ${i.depth}. Language: ${i.language}.\n` +
    `Known concerns: ${i.primaryConcerns.join(", ") || "(none)"}. Dominant emotions: ${i.dominantEmotions.join(", ") || "(none)"}. Maintaining loops: ${i.maintainingLoops.join(", ") || "(none)"}.\n` +
    `Produce the Dilts six-level map + 5P formulation + a short formulationSummary.`,
  example: {
    input: { problemStatement: "我一开会就紧张，怕说错话，所以总是沉默，会后又很后悔，觉得自己很没用。", depth: "standard", primaryConcerns: ["会议焦虑", "回避表达"], dominantEmotions: ["焦虑", "羞耻"], maintainingLoops: ["anxiety_avoidance"], language: "zh" },
    output: {
      diltsMap: {
        environment: [{ item: "会议、上级、公开表达场景", evidence: "我一开会就紧张" }],
        behavior: [{ item: "沉默、回避表达", evidence: "所以总是沉默", shortTermFunction: "立刻降低被评价的焦虑", longTermCost: "失去练习机会，强化'我不行'" }],
        capability: [{ item: "公开表达", currentGap: "在压力下组织并说出观点", trainableSkill: "结构化表达 + 焦虑调节" }],
        beliefAndValues: [{ belief: "我说错话就会被否定", type: "conditional_belief", evidence: "怕说错话", possibleOrigin: "可能与长期对评价敏感有关", impact: "回避表达、会后反刍" }],
        identity: [{ narrative: "我是一个不够有能力的人", evidence: "觉得自己很没用", cost: "不敢承担表达性角色", alternativeIdentitySeed: "我是一个正在练习表达的人" }],
        mission: [{ blockedCalling: "承担更有影响力的表达性角色", fear: "被否定与羞耻", growthDirection: "在低风险场景练习表达，逐步扩展" }],
      },
      fiveP: {
        presentingProblems: ["会议焦虑", "表达回避", "会后自责"],
        predisposingFactors: ["可能长期对评价敏感", "可能有完美主义倾向"],
        precipitatingFactors: ["公开发言", "上级在场"],
        perpetuatingFactors: ["回避带来短期安全感，长期强化'我不行'", "会后反刍"],
        protectiveFactors: ["有自我觉察", "愿意改变", "能识别模式"],
      },
      formulationSummary: "会议这一评价性场景触发被否定的恐惧，沉默回避在短期内缓解焦虑，却在长期减少成功表达的证据，逐步沉淀为'我不够有能力'的身份叙事。你已具备觉察与改变意愿，这是重要的保护性资源。",
    },
  },
  temperature: 0.4,
});
