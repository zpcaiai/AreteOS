// ───────────────────────── Healing OS · Safety rules ─────────────────────────
// The deterministic spine of the safety gate. PURE (no LLM, no Prisma): bilingual
// keyword pre-screen, escalate-only risk overrides, a conservative fallback for
// when the model misbehaves, and the route/skill/plan policy. Designed so the
// most dangerous cases (suicide-with-plan, active self-harm, harm-to-others,
// psychosis-with-danger) are caught by RULES, never left to the model alone, and
// so risk can only ever move UP from a model's estimate — never down.

import {
  type RiskLevel,
  type RiskDomain,
  type DetectedSignal,
  type SafetyClassification,
  type SafetyTriageOutput,
  type RecommendedRoute,
  riskAtLeast,
  RISK_RANK,
  ROUTE_FOR_LEVEL,
  DEEP_SKILLS_BLOCKED_ON_RISK,
  CRISIS_SAFE_SKILLS,
} from "../domain/risk";
import { crisisResourcesFor, UNIVERSAL_CRISIS_GUIDANCE } from "./crisis-resources";

type SignalKind = "intent" | "plan" | "active" | "symptom" | "danger";

interface RawSignal {
  domain: RiskDomain;
  kind: SignalKind;
  evidence: string; // the phrase that matched
  severity: "low" | "medium" | "high";
}

interface Matcher {
  domain: RiskDomain;
  kind: SignalKind;
  severity: "low" | "medium" | "high";
  re: RegExp;
}

// Bilingual (zh + en). Kept deliberately broad on the high-severity side; the
// LLM refines, but these rules set the floor. `i` flag for English casing.
const MATCHERS: Matcher[] = [
  // ── Suicidal intent ──
  { domain: "suicide", kind: "intent", severity: "high", re: /自杀|想死|不想活|不想活了|活不下去|结束(自己的)?生命|结束(这|那)?一切|了结(自己|这一切|一切)|不想再(撑|活|坚持|忍)|撑不下去|不想再醒(来|过来)|轻生|寻短见|kill myself|killing myself|end my life|ending my life|end it all|end it tonight|want to die|wanna die|don'?t want to (be alive|live)|better off dead|take my (own )?life/i },
  // ── Plan / means / time (escalators, not standalone domains) ──
  { domain: "suicide", kind: "plan", severity: "high", re: /今晚|今天晚上|明天|马上|现在就|待会儿?|计划好|准备好(了)?|写好遗书|遗书|跳楼|跳桥|上吊|割腕|(吃|服|吞)(下)?(很多|一些|大量|整瓶|一整瓶|一瓶|安眠)?药|安眠药|一(整)?瓶(药)?|过量|烧炭|绳子|跳轨|tonight|tomorrow|right now|a plan|planned (it|to)|pills|overdose|od\b|jump (off|from)|hang myself|hanging myself|rope|razor|bridge|gun|firearm|carbon monoxide/i },
  // ── Active self-harm in progress ──
  { domain: "self_harm", kind: "active", severity: "high", re: /正在(割|自残|伤害自己)|我(刚|在)割(了|腕)|我自残(了)?|流(了很多)?血|割伤自己|cutting myself|cut myself|hurting myself|harmed myself|burned myself|i'?m bleeding/i },
  // ── Self-harm ideation (non-active) ──
  { domain: "self_harm", kind: "intent", severity: "medium", re: /想(要)?(自残|伤害自己|割自己)|想割|self.?harm|hurt myself|want to cut/i },
  // ── Harm to others ──
  { domain: "harm_to_others", kind: "intent", severity: "high", re: /想杀(了)?(他|她|他们|你)|杀了(他|她|他们)|伤害别人|报复(他|她|社会)|让他们付出代价|kill (him|her|them|someone|people)|hurt (him|her|them|someone)|make them pay|shoot up|攻击别人/i },
  // ── Psychosis with danger ──
  { domain: "psychosis", kind: "danger", severity: "high", re: /有人(在)?监控我|被监视|被(人)?控制|他们要(害|杀)我|幻听|听到(有)?声音(让|叫|命令)我|声音让我|被下毒|voices (telling|commanding) me|being watched|they'?re (controlling|after) me|implant(ed)? in my/i },
  // ── Mania ──
  { domain: "mania", kind: "symptom", severity: "medium", re: /(好)?几天(没|不)睡|不需要睡(觉|眠)|精力(无限|爆棚)|停不下来|思维(奔逸|飞快)|haven'?t slept (in|for) (days|\d)|don'?t need (to )?sleep|racing thoughts|can'?t stop (talking|spending)/i },
  // ── Severe dissociation ──
  { domain: "severe_dissociation", kind: "symptom", severity: "medium", re: /感觉(很)?不真实|不像真的|灵魂出窍|感觉不到(自己|身体)|抽离|像在梦里|not real|unreal|outside my body|detached from (myself|my body)|watching myself|depersonali[sz]/i },
  // ── Domestic violence ──
  { domain: "domestic_violence", kind: "active", severity: "high", re: /家暴|他(打|揍)我|她打我|被(打|虐待|威胁)|伴侣打我|hits me|beats me|abus(es|ing) me|threatens? to (hurt|kill) me/i },
  // ── Substance withdrawal ──
  { domain: "substance_withdrawal", kind: "symptom", severity: "medium", re: /戒断(反应)?|戒酒|戒毒|断药|withdrawal|detox(ing)?|dts\b|delirium tremens/i },
  // ── Eating disorder ──
  { domain: "eating_disorder", kind: "symptom", severity: "medium", re: /催吐|暴食(后)?催吐|好几天没(吃|进食)|不敢吃|清肠|purg(e|ing)|binge and (purge|vomit)|haven'?t eaten (in|for) (days|\d)|starv(e|ing) myself/i },
  // ── Medical emergency ──
  { domain: "medical_emergency", kind: "active", severity: "high", re: /吃了(很多|一(整)?瓶)药|服(用过量|了很多)|大出血|失去意识|overdosed|took (a lot of|many|all the) (pills|tablets)|won'?t stop bleeding|unconscious/i },
];

/** Scan a message for risk signals (bilingual). Pure + side-effect-free. */
export function keywordPreScreen(message: string): RawSignal[] {
  const out: RawSignal[] = [];
  for (const m of MATCHERS) {
    const hit = message.match(m.re);
    if (hit) out.push({ domain: m.domain, kind: m.kind, evidence: hit[0], severity: m.severity });
  }
  return out;
}

export function toDetectedSignals(raw: RawSignal[]): DetectedSignal[] {
  return raw.map((r) => ({ signal: `${r.domain}:${r.kind}`, evidence: r.evidence, severity: r.severity }));
}

const has = (raw: RawSignal[], domain: RiskDomain, kind?: SignalKind) =>
  raw.some((r) => r.domain === domain && (kind ? r.kind === kind : true));

/**
 * Deterministic, ESCALATE-ONLY override. Given the model's level + the keyword
 * signals, return the final level (never below the model's), the domains the
 * rules force on, and whether a rule fired. The red cases here do NOT depend on
 * the model at all.
 */
export function applyRiskOverrides(
  modelLevel: RiskLevel,
  raw: RawSignal[],
): { level: RiskLevel; forcedDomains: RiskDomain[]; overridden: boolean } {
  let ruleLevel: RiskLevel = "green";
  const forced = new Set<RiskDomain>();
  const bump = (lvl: RiskLevel, ...domains: RiskDomain[]) => {
    ruleLevel = riskAtLeast(ruleLevel, lvl);
    domains.forEach((d) => forced.add(d));
  };

  // RED — imminent danger.
  if (has(raw, "suicide", "intent") && (has(raw, "suicide", "plan") || has(raw, "medical_emergency", "active"))) bump("red", "suicide");
  if (has(raw, "self_harm", "active")) bump("red", "self_harm");
  if (has(raw, "harm_to_others", "intent")) bump("red", "harm_to_others");
  if (has(raw, "psychosis", "danger")) bump("red", "psychosis");
  if (has(raw, "medical_emergency", "active")) bump("red", "medical_emergency");

  // ORANGE — concerning, stabilization-first.
  if (has(raw, "suicide", "intent")) bump("orange", "suicide");
  if (has(raw, "self_harm", "intent")) bump("orange", "self_harm");
  if (has(raw, "domestic_violence")) bump("orange", "domestic_violence");
  if (has(raw, "psychosis")) bump("orange", "psychosis");
  if (has(raw, "mania")) bump("orange", "mania");
  if (has(raw, "severe_dissociation")) bump("orange", "severe_dissociation");
  if (has(raw, "substance_withdrawal")) bump("orange", "substance_withdrawal");
  if (has(raw, "eating_disorder")) bump("orange", "eating_disorder");

  const level = riskAtLeast(modelLevel, ruleLevel);
  // "Overridden" = a rule escalated the model's level upward.
  const overridden = RISK_RANK[level] > RISK_RANK[modelLevel];
  return { level, forcedDomains: [...forced], overridden };
}

/**
 * When the model output is missing/invalid, never trust silence. Derive a
 * conservative classification from keyword signals: any signal → orange (the
 * overrides will push to red if warranted), otherwise yellow. NEVER green.
 */
export function conservativeFallback(message: string): { classification: SafetyClassification; raw: RawSignal[] } {
  const raw = keywordPreScreen(message);
  const domains = raw.length ? [...new Set(raw.map((r) => r.domain))] : (["none"] as RiskDomain[]);
  const classification: SafetyClassification = {
    riskLevel: raw.length ? "orange" : "yellow",
    riskDomains: domains.length ? domains : ["none"],
    confidence: 0.3,
    detectedSignals: toDetectedSignals(raw),
  };
  return { classification, raw };
}

// ── Vetted, deterministic crisis copy (never model-generated for orange/red) ──
const GROUNDING = {
  zh: "5-4-3-2-1 着陆练习：说出你现在能看到的 5 样东西、能听到的 4 种声音、能摸到的 3 样东西、能闻到的 2 种气味、能尝到的 1 种味道。慢慢做，重复一次。",
  en: "5-4-3-2-1 grounding: name 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, 1 you can taste. Go slowly; repeat once.",
};

function userMessageFor(level: RiskLevel, locale: string): string {
  const zh = locale.toLowerCase().startsWith("zh") || locale.toUpperCase().includes("CN");
  switch (level) {
    case "red":
      return zh
        ? "我很担心你现在的安全。你现在不需要独自面对。请立刻拨打你所在地的紧急电话，或联系危机热线、身边可信任的人。我会先停下深入分析，陪你做一件能立刻稳住自己的事。"
        : "I'm concerned for your safety right now. You don't have to face this alone. Please call your local emergency number, a crisis line, or someone you trust right now. I'll pause the deeper work and stay with one thing that can steady you immediately.";
    case "orange":
      return zh
        ? "听起来你现在承受了很多。我们先暂停深挖问题，花 60 秒做一个稳定化练习，再决定下一步。如果情况变得更危险，请联系现实中的支持。"
        : "It sounds like you're carrying a lot right now. Let's pause the deeper work and take 60 seconds to steady ourselves first, then decide the next step. If things feel more dangerous, please reach out to real-world support.";
    case "yellow":
      return zh
        ? "看起来你现在压力很大。我们可以慢慢来，把问题拆小一点，一步一步看。"
        : "It looks like you're under real pressure. We can take this slowly and break the problem into smaller pieces, one step at a time.";
    default:
      return zh ? "我们继续。" : "Let's continue.";
  }
}

export interface PolicyInput {
  level: RiskLevel;
  domains: RiskDomain[];
  locale?: string;
  /** Optional model-written supportive line — used ONLY for green/yellow. */
  supportiveMessage?: string;
}

/** Deterministic route + allowed/blocked skills + user message + safety plan. */
export function derivePolicy(p: PolicyInput): Pick<
  SafetyTriageOutput,
  "recommendedRoute" | "allowedNextSkills" | "blockedSkills" | "userFacingMessage" | "safetyPlan"
> {
  const locale = p.locale ?? "zh-CN";
  const zh = locale.toLowerCase().startsWith("zh") || locale.toUpperCase().includes("CN");
  const route: RecommendedRoute = ROUTE_FOR_LEVEL[p.level];
  const blockHigh = p.level === "orange" || p.level === "red";

  const blockedSkills = blockHigh ? [...DEEP_SKILLS_BLOCKED_ON_RISK] : [];
  const allowedNextSkills =
    p.level === "red"
      ? [...CRISIS_SAFE_SKILLS]
      : p.level === "orange"
        ? ["stabilization", "grounding", "emotion-regulation"]
        : p.level === "yellow"
          ? ["intake", "emotion-regulation", "cbt"]
          : ["intake", "dilts-map", "case-formulation"];

  // For green/yellow prefer the model's supportive line if present; else vetted copy.
  const userFacingMessage =
    (p.level === "green" || p.level === "yellow") && p.supportiveMessage?.trim()
      ? p.supportiveMessage.trim()
      : userMessageFor(p.level, locale);

  let safetyPlan: SafetyTriageOutput["safetyPlan"] | undefined;
  if (blockHigh) {
    const resources = crisisResourcesFor(locale)
      .map((r) => `${r.name}: ${r.contact}${r.hours ? ` (${r.hours})` : ""}`)
      .join(" · ");
    safetyPlan = {
      immediateSteps: zh
        ? [
            "把注意力放到呼吸上：吸气 4 秒，停 4 秒，呼气 6 秒，重复 5 次。",
            "如果有伤害自己或他人的冲动，先离开危险物品，移动到有人的地方。",
            "联系一个你信任的人，告诉他们你现在不太好。",
          ]
        : [
            "Bring attention to your breath: in for 4, hold 4, out for 6 — repeat 5 times.",
            "If there's an urge to harm yourself or anyone, move away from anything dangerous and toward people.",
            "Reach out to one person you trust and tell them you're not okay right now.",
          ],
      supportContactsPrompt: zh
        ? `${UNIVERSAL_CRISIS_GUIDANCE.zh}\n可用资源：${resources}`
        : `${UNIVERSAL_CRISIS_GUIDANCE.en}\nResources: ${resources}`,
      groundingExercise: zh ? GROUNDING.zh : GROUNDING.en,
      professionalHelpRecommendation: zh
        ? "这超出了一个自助工具能安全处理的范围。请尽快联系心理健康专业人员、危机热线或急救服务。"
        : "This is beyond what a self-help tool can safely handle. Please contact a mental-health professional, a crisis line, or emergency services as soon as you can.",
    };
  }

  return { recommendedRoute: route, allowedNextSkills, blockedSkills, userFacingMessage, safetyPlan };
}

/**
 * Compose the FINAL triage output from a (model or fallback) classification +
 * the raw signals + the original message. Pure — the service layer just persists
 * what this returns. Guarantees: rules can only escalate; orange/red always
 * block the deep skills and carry a safety plan; output always schema-valid.
 */
export function composeTriage(
  classification: SafetyClassification,
  raw: RawSignal[],
  opts: { locale?: string; supportiveMessage?: string } = {},
): { output: SafetyTriageOutput; overridden: boolean } {
  const { level, forcedDomains, overridden } = applyRiskOverrides(classification.riskLevel, raw);

  // Merge model domains + rule-forced domains; drop "none" if any real domain exists.
  const merged = new Set<RiskDomain>([...classification.riskDomains, ...forcedDomains]);
  if (merged.size > 1) merged.delete("none");
  const riskDomains = [...merged];

  // Union of detected signals (model + keyword), de-duplicated by evidence.
  const modelSignals = classification.detectedSignals ?? [];
  const kwSignals = toDetectedSignals(raw);
  const byKey = new Map<string, DetectedSignal>();
  for (const s of [...modelSignals, ...kwSignals]) byKey.set(`${s.signal}|${s.evidence}`, s);

  const policy = derivePolicy({ level, domains: riskDomains, locale: opts.locale, supportiveMessage: opts.supportiveMessage });

  const output: SafetyTriageOutput = {
    riskLevel: level,
    riskDomains: riskDomains.length ? riskDomains : ["none"],
    confidence: classification.confidence,
    detectedSignals: [...byKey.values()],
    ...policy,
  };
  return { output, overridden };
}
