// Catalog of the 20 Skills-Library engines. Pure data + types (no runtime side
// effects), consumed by the coach-agent factory, the service, the API route, and
// the bilingual UI. Each engine maps to a scoring mode + factors (a ratio engine
// marks one factor `denom: true`). Labels are bilingual so the UI is zh/en without
// touching the global dictionary.

import type { ScoreMode } from "./skills-scoring";

export interface Bi { zh: string; en: string }
export interface SkillFactor { key: string; label: Bi; denom?: boolean }
export interface SkillExample { summary: string; keyInsight: string; topActions: string[]; risk: string }
export interface SkillEngine {
  slug: string;
  tier: 1 | 2; // 1 = Plus, 2 = Pro
  mode: ScoreMode;
  title: Bi;
  subtitle: Bi;
  factors: SkillFactor[];
  system: string;
  example: SkillExample;
}

const F = (key: string, zh: string, en: string, denom = false): SkillFactor => ({ key, label: { zh, en }, denom });

export const SKILLS: SkillEngine[] = [
  {
    slug: "specific-knowledge", tier: 1, mode: "mean",
    title: { zh: "独特知识", en: "Specific Knowledge" },
    subtitle: { zh: "发现你难以被复制的稀有知识组合。", en: "Find the rare, hard-to-replicate knowledge only you have." },
    factors: [F("curiosityDepth","好奇深度","Curiosity depth"),F("experienceDepth","经验深度","Experience depth"),F("skillRarity","技能稀有度","Skill rarity"),F("energy","投入能量","Energy"),F("marketRelevance","市场相关性","Market relevance"),F("compoundingPotential","复利潜力","Compounding potential")],
    system: "You map the user's rare combination of curiosity, experience, skill, and market relevance into Specific Knowledge and asset opportunities. Avoid generic career advice; find the unfair, hard-to-replicate intersection.",
    example: { summary: "Your edge is the intersection of systems thinking and hands-on teaching.", keyInsight: "Few people can both build the system and explain it simply — that is your moat.", topActions: ["Publish one teardown that only you could write","Turn a repeated question you get into a reusable asset","Track which topics give energy vs drain it for 2 weeks"], risk: "Spreading across domains instead of compounding the one rare intersection." },
  },
  {
    slug: "archetype-identity", tier: 2, mode: "ratio",
    title: { zh: "原型身份", en: "Archetype Identity" },
    subtitle: { zh: "发现并整合驱动你的深层身份原型。", en: "Discover and integrate the archetypes that drive you." },
    factors: [F("clarity","清晰度","Clarity"),F("integration","整合度","Integration"),F("evolution","演化度","Evolution"),F("conflict","原型冲突","Archetype conflict",true)],
    system: "You map the user's identity archetype stack (primary/secondary/emerging/shadow), name conflicts between archetypes, and guide integration. Not a personality quiz — an identity architecture.",
    example: { summary: "Primary Sage with an emerging Ruler; the tension is analysis vs decisive action.", keyInsight: "Your Sage protects you from being wrong; your Ruler needs you to decide anyway.", topActions: ["Name one decision you'll make this week with 70% information","Give the Sage a fixed research budget, then commit","Write the identity statement of who you're becoming"], risk: "Letting the Sage's need for certainty quietly veto the Ruler." },
  },
  {
    slug: "principle-centered-life", tier: 1, mode: "geomean",
    title: { zh: "原则中心生活", en: "Principle-Centered Life" },
    subtitle: { zh: "用原则而非情绪治理你的生活与角色。", en: "Govern life by principles and roles, not moods." },
    factors: [F("clarity","原则清晰","Principle clarity"),F("roleAlignment","角色对齐","Role alignment"),F("integrity","正直一致","Integrity"),F("weeklyCompass","每周罗盘","Weekly compass"),F("renewal","更新实践","Renewal")],
    system: "You help the user define principles, steward life roles, and build a personal constitution and weekly compass. Surface where short-term urgency overrides stated values.",
    example: { summary: "Your principles are clear but one role (health) is chronically neglected.", keyInsight: "Integrity is leaking where urgency keeps beating importance.", topActions: ["Pick one priority per role for the week","Define one hard 'no' that protects a principle","Schedule a non-negotiable renewal block"], risk: "A strong week of work crowding out the neglected role again." },
  },
  {
    slug: "deliberate-practice", tier: 1, mode: "geomean",
    title: { zh: "刻意练习", en: "Deliberate Practice" },
    subtitle: { zh: "把模糊的进步变成结构化的精通。", en: "Turn vague improvement into structured mastery." },
    factors: [F("consistency","练习一致性","Consistency"),F("stretchZone","拉伸区","Stretch zone"),F("feedbackQuality","反馈质量","Feedback quality"),F("errorCorrection","纠错","Error correction"),F("subSkillGrowth","子技能成长","Sub-skill growth")],
    system: "You decompose a skill into sub-skills, isolate the weakest, design a stretch drill with feedback, and track error correction. Practice is not repetition.",
    example: { summary: "You practice consistently but stay in the comfort zone.", keyInsight: "No stretch and weak feedback means reps without growth.", topActions: ["Isolate the single weakest sub-skill","Design a drill you fail ~30% of the time","Log errors and one correction per session"], risk: "Comfortable repetition masquerading as practice." },
  },
  {
    slug: "cognitive-bias", tier: 2, mode: "ratio",
    title: { zh: "认知偏差", en: "Cognitive Bias" },
    subtitle: { zh: "在决策中发现并矫正认知偏差。", en: "Detect and correct cognitive bias in decisions." },
    factors: [F("awareness","偏差觉察","Bias awareness"),F("debiasingUsage","去偏使用","Debiasing usage"),F("decisionCorrection","决策矫正","Decision correction"),F("biasRisk","偏差风险","Bias risk",true)],
    system: "You detect likely cognitive biases in the user's reasoning, explain the risk, and prescribe a debiasing protocol (inversion, pre-mortem, base rates, outside view). Improve judgment, don't kill intuition.",
    example: { summary: "Your thesis leans on confirming evidence and a vivid recent example.", keyInsight: "Confirmation + availability are inflating your confidence.", topActions: ["Write the strongest case for the opposite","Run a pre-mortem: assume it failed, why?","Find the base rate before deciding"], risk: "Mistaking conviction for evidence." },
  },
  {
    slug: "double-loop-learning", tier: 1, mode: "geomean",
    title: { zh: "双环学习", en: "Double-Loop Learning" },
    subtitle: { zh: "不止改行动,更要质询底层假设。", en: "Question underlying assumptions, not just actions." },
    factors: [F("reflectionDepth","反思深度","Reflection depth"),F("assumptionDetection","假设识别","Assumption detection"),F("mentalModelRevision","心智模型修订","Model revision"),F("decisionRuleUpdate","决策规则更新","Rule update"),F("behaviorChange","行为改变","Behavior change")],
    system: "Given a surprise or failure, you find the assumption that produced the action, test it, revise the mental model, and update the decision rule. Single-loop fixes the action; double-loop fixes the belief.",
    example: { summary: "You corrected the tactic but not the assumption underneath it.", keyInsight: "The same belief will reproduce the same failure in a new form.", topActions: ["Name the assumption behind the failed action","Find one piece of evidence against it","Write the replacement decision rule"], risk: "Treating a belief problem as a tactics problem." },
  },
  {
    slug: "flow-state", tier: 1, mode: "ratio",
    title: { zh: "心流状态", en: "Flow State" },
    subtitle: { zh: "设计高投入、低分心的深度工作时段。", en: "Design deeply engaging, low-distraction sessions." },
    factors: [F("clearGoal","清晰目标","Clear goal"),F("challengeSkillFit","挑战-技能匹配","Challenge-skill fit"),F("feedback","即时反馈","Feedback"),F("focus","专注","Focus"),F("intrinsicInterest","内在兴趣","Intrinsic interest"),F("distraction","分心","Distraction",true)],
    system: "You calibrate challenge-skill balance, sharpen the goal and feedback signal, and remove distraction so the user can enter flow. Name which condition is missing.",
    example: { summary: "Skill exceeds challenge — you're drifting toward boredom.", keyInsight: "The task is too easy and the feedback loop is too slow.", topActions: ["Raise the challenge or add a constraint","Define a feedback signal you see within minutes","Remove the top distraction before starting"], risk: "Comfortable, low-challenge work that never reaches flow." },
  },
  {
    slug: "intrinsic-motivation", tier: 1, mode: "ratio",
    title: { zh: "内在动机", en: "Intrinsic Motivation" },
    subtitle: { zh: "用自主、胜任、联结设计可持续动机。", en: "Design durable motivation: autonomy, competence, relatedness." },
    factors: [F("autonomy","自主","Autonomy"),F("competence","胜任","Competence"),F("relatedness","联结","Relatedness"),F("externalPressure","外部压力","External pressure",true)],
    system: "You diagnose whether motivation fails on autonomy, competence, or relatedness, and redesign the goal accordingly. Externally pressured goals are fragile.",
    example: { summary: "Competence is fine, but autonomy is low — this feels imposed.", keyInsight: "You're acting from pressure, not ownership; that won't last.", topActions: ["Reconnect the goal to a value you chose","Create one meaningful option in how you do it","Share progress with someone who matters"], risk: "Sustaining on willpower until it snaps." },
  },
  {
    slug: "antifragile-life", tier: 2, mode: "ratio",
    title: { zh: "反脆弱人生", en: "Antifragile Life" },
    subtitle: { zh: "降低脆弱、增加选择权,从波动中获益。", en: "Reduce fragility, build optionality, gain from volatility." },
    factors: [F("resilience","韧性","Resilience"),F("optionality","选择权","Optionality"),F("stressRecovery","压力恢复","Stress recovery"),F("antifragilePractice","反脆弱实践","Antifragile practice"),F("fragility","脆弱性","Fragility",true)],
    system: "You map the user's fragilities and dependencies, run stress tests, and design a barbell (safe base + high-upside experiments) so volatility helps rather than harms.",
    example: { summary: "One income source carries almost all your downside.", keyInsight: "A single dependency turns normal volatility into existential risk.", topActions: ["Cap the worst-case (buffer + backup)","Start one capped-downside, high-upside experiment","List what would make you stronger after a shock"], risk: "Optimizing efficiency while quietly increasing fragility." },
  },
  {
    slug: "deep-work", tier: 1, mode: "ratio",
    title: { zh: "深度工作", en: "Deep Work" },
    subtitle: { zh: "用结构化深度专注产出高价值成果。", en: "Produce high-value output through structured focus." },
    factors: [F("consistency","一致性","Consistency"),F("focusDepth","专注深度","Focus depth"),F("cognitiveDifficulty","认知难度","Cognitive difficulty"),F("outputValue","产出价值","Output value"),F("distraction","分心","Distraction",true)],
    system: "You help the user pick a deep-work mode and ritual, defend it from distraction, and ensure each block produces a real asset. Deep work is output, not time.",
    example: { summary: "Long sessions, but distraction is shredding their depth.", keyInsight: "Time-in-seat is high; protected attention is low.", topActions: ["Pick a mode (rhythmic) and a fixed block","Write a shutdown + startup ritual","Name the asset each block must produce"], risk: "Calling shallow, interrupted time 'deep work'." },
  },
  {
    slug: "growth-mindset", tier: 1, mode: "ratio",
    title: { zh: "成长型心态", en: "Growth Mindset" },
    subtitle: { zh: "把固定型信念重构为成长型策略。", en: "Reframe fixed beliefs into growth strategies." },
    factors: [F("growthMindset","成长信念","Growth belief"),F("challengeTolerance","挑战耐受","Challenge tolerance"),F("feedbackLearning","反馈学习","Feedback learning"),F("effortStrategy","努力与策略","Effort & strategy"),F("fixedMindsetRisk","固定型风险","Fixed-mindset risk",true)],
    system: "You detect fixed-mindset statements, reframe them into improvable strategies, and prescribe a small challenge. Failure is feedback, not a verdict on ability.",
    example: { summary: "You treat one skill as a fixed trait, so you avoid the challenge.", keyInsight: "'I'm bad at X' is a strategy gap, not a permanent ceiling.", topActions: ["Reframe the belief as a current-strategy problem","Pick a challenge you might fail and try it","Track effort + strategy, not just outcome"], risk: "Avoiding challenges to protect a fragile self-image." },
  },
  {
    slug: "behavior-design", tier: 1, mode: "ratio",
    title: { zh: "行为设计", en: "Behavior Design" },
    subtitle: { zh: "用动机、能力、提示让行为真正发生。", en: "Make behavior happen via motivation, ability, prompt." },
    factors: [F("motivationFit","动机匹配","Motivation fit"),F("abilityFit","能力匹配","Ability fit"),F("promptReliability","提示可靠性","Prompt reliability"),F("identityAlignment","身份对齐","Identity alignment"),F("friction","阻力","Friction",true)],
    system: "You diagnose why a behavior isn't happening (motivation, ability, or prompt), shrink it to a tiny version, and attach a reliable prompt. Make it easy and well-triggered.",
    example: { summary: "The behavior is too big and has no reliable prompt.", keyInsight: "Low ability + missing prompt, not low motivation, is the blocker.", topActions: ["Shrink it to a 2-minute version","Anchor it to an existing routine","Remove one source of friction"], risk: "Relying on motivation to carry a behavior that's too hard." },
  },
  {
    slug: "identity-based-habit", tier: 1, mode: "ratio",
    title: { zh: "身份型习惯", en: "Identity-Based Habit" },
    subtitle: { zh: "让每个习惯成为你想成为之人的证据。", en: "Make each habit a vote for who you're becoming." },
    factors: [F("habitConsistency","习惯一致性","Habit consistency"),F("positiveVotes","正向投票","Positive votes"),F("proofQuality","证据质量","Proof quality"),F("contradictionRisk","矛盾风险","Contradiction risk",true)],
    system: "You tie habits to a desired identity, frame each rep as identity evidence, and flag behaviors that contradict the identity. Habits are votes for who you are becoming.",
    example: { summary: "Your habits are consistent but you don't connect them to identity.", keyInsight: "Unclaimed reps don't compound into a stable self-concept.", topActions: ["State the identity each habit proves","After each rep, write one proof sentence","Replace one contradicting behavior"], risk: "A contradicting behavior quietly outvoting the desired identity." },
  },
  {
    slug: "ooda-adaptive-action", tier: 2, mode: "geomean",
    title: { zh: "OODA 自适应行动", en: "OODA Adaptive Action" },
    subtitle: { zh: "在不确定中更快观察—定向—决策—行动。", en: "Observe-Orient-Decide-Act faster under uncertainty." },
    factors: [F("observationQuality","观察质量","Observation quality"),F("orientationAccuracy","定向准确","Orientation accuracy"),F("decisionSpeed","决策速度","Decision speed"),F("feedbackLearning","反馈学习","Feedback learning"),F("actionExecution","行动执行","Action execution")],
    system: "You run the user through Observe-Orient-Decide-Act for an adaptive challenge, surfacing weak observation, slow orientation, or hesitant action, and tightening the loop.",
    example: { summary: "Good observation, but orientation is slow and action hesitant.", keyInsight: "You're stuck re-interpreting instead of acting and updating.", topActions: ["Commit to one action and a feedback checkpoint","Timebox orientation to avoid analysis loops","After acting, update your orientation explicitly"], risk: "Looping on Orient while the situation moves." },
  },
  {
    slug: "design-thinking", tier: 2, mode: "mean",
    title: { zh: "设计思维", en: "Design Thinking" },
    subtitle: { zh: "用同理、定义、构思、原型、测试验证想法。", en: "Empathize, define, ideate, prototype, test." },
    factors: [F("empathyDepth","同理深度","Empathy depth"),F("problemClarity","问题清晰","Problem clarity"),F("ideaDiversity","创意多样性","Idea diversity"),F("prototypeSpeed","原型速度","Prototype speed"),F("feedbackQuality","反馈质量","Feedback quality"),F("iterationLearning","迭代学习","Iteration learning")],
    system: "You guide the user from user empathy to a sharp problem statement, diverse ideas, a fast prototype, and real feedback. Fall in love with the problem, not the first solution.",
    example: { summary: "You jumped to a solution before defining the real problem.", keyInsight: "Weak empathy means you're solving an assumed problem.", topActions: ["Interview 3 real users about the pain","Write a one-line problem statement","Build the cheapest prototype that tests it"], risk: "Polishing a solution to a problem nobody has." },
  },
  {
    slug: "creativity-capability", tier: 2, mode: "ratio",
    title: { zh: "创造力能力", en: "Creativity Capability" },
    subtitle: { zh: "用领域力、创造性思维与实验提升创造产出。", en: "Grow creative output via expertise, thinking, experiments." },
    factors: [F("expertise","领域专长","Domain expertise"),F("creativeThinking","创造性思维","Creative thinking"),F("intrinsicMotivation","内在动机","Intrinsic motivation"),F("experimentation","实验","Experimentation"),F("creativeBlockRisk","创作阻塞风险","Creative-block risk",true)],
    system: "You raise creative output by combining domain expertise with creative-thinking moves (analogy, inversion, recombination) and a fast experiment loop, while clearing creative blocks.",
    example: { summary: "Strong expertise, but perfectionism is blocking output.", keyInsight: "Judgment is firing too early, killing divergent ideas.", topActions: ["Separate idea generation from evaluation","Force 10 bad ideas before judging any","Ship one rough experiment this week"], risk: "Perfectionism strangling ideas before they breathe." },
  },
  {
    slug: "mastery-learning", tier: 1, mode: "mean",
    title: { zh: "掌握式学习", en: "Mastery Learning" },
    subtitle: { zh: "先掌握前置,再前进;诊断—补救—进阶。", en: "Master prerequisites before advancing." },
    factors: [F("objectiveMastery","目标掌握","Objective mastery"),F("prerequisiteReadiness","前置就绪","Prerequisite readiness"),F("gapClosure","差距弥合","Gap closure"),F("remediationCompletion","补救完成","Remediation completion")],
    system: "You diagnose what the learner already understands, detect the missing prerequisite, and only advance after a mastery check. No moving on with shaky foundations.",
    example: { summary: "You're advancing despite a shaky prerequisite.", keyInsight: "The missing prerequisite will cap everything built on top of it.", topActions: ["Take a diagnostic on the prerequisite","Remediate the one weakest concept","Pass a mastery check before advancing"], risk: "Stacking new material on an unmastered base." },
  },
  {
    slug: "experiential-learning", tier: 1, mode: "mean",
    title: { zh: "经验学习", en: "Experiential Learning" },
    subtitle: { zh: "经验→反思→提炼原则→实验,闭合循环。", en: "Experience → reflect → conceptualize → experiment." },
    factors: [F("experienceCapture","经验捕捉","Experience capture"),F("reflectionQuality","反思质量","Reflection quality"),F("insightExtraction","洞察提炼","Insight extraction"),F("experimentExecution","实验执行","Experiment execution"),F("cycleCompletion","循环完成","Cycle completion")],
    system: "You convert a concrete experience into a reflection, an abstract principle, and a concrete next experiment — then close the loop with the result.",
    example: { summary: "You capture experiences but rarely extract a transferable principle.", keyInsight: "Without conceptualization, experience doesn't compound into knowledge.", topActions: ["Write what happened and what you noticed","State one principle you can transfer","Design the next experiment to test it"], risk: "Collecting experiences without closing the learning loop." },
  },
  {
    slug: "learning-organization", tier: 2, mode: "geomean",
    title: { zh: "学习型组织", en: "Learning Organization" },
    subtitle: { zh: "用五项修炼让团队成为学习系统。", en: "Make the team a learning system (five disciplines)." },
    factors: [F("systemsThinking","系统思考","Systems thinking"),F("personalMastery","自我超越","Personal mastery"),F("mentalModelClarity","心智模型清晰","Mental-model clarity"),F("sharedVisionAlignment","共同愿景对齐","Shared-vision alignment"),F("teamLearning","团队学习","Team learning")],
    system: "You assess the team across systems thinking, personal mastery, mental models, shared vision, and team learning, and surface where the system reproduces failure.",
    example: { summary: "Shared vision is stated but not aligned in daily decisions.", keyInsight: "The team is repeating a failure because an assumption goes unchallenged.", topActions: ["Run one blameless failure review","Surface and test one shared mental model","Re-align the vision to a concrete decision"], risk: "Local optimization quietly degrading the whole system." },
  },
  {
    slug: "psychological-safety", tier: 2, mode: "ratio",
    title: { zh: "心理安全", en: "Psychological Safety" },
    subtitle: { zh: "让真相能浮现:敢说、敢认错、敢挑战。", en: "Make truth surfaceable: speak up, admit, challenge." },
    factors: [F("speakUp","敢于发声","Speak up"),F("mistakeSafety","认错安全","Mistake safety"),F("helpSeeking","求助","Help seeking"),F("challenge","挑战权威","Challenge"),F("inclusion","包容","Inclusion"),F("silenceRisk","沉默风险","Silence risk",true)],
    system: "You assess whether people can speak up, admit mistakes, ask for help, and challenge ideas without fear, detect silence risk, and coach leader responses. Safety is candor for performance, not comfort.",
    example: { summary: "Meetings are quiet and dissent is rare — silence risk is high.", keyInsight: "Agreement may be hiding unspoken risk, not consensus.", topActions: ["Ask for the strongest objection, explicitly","Thank the next person who admits a mistake","Have the leader speak last, not first"], risk: "Mistaking silence for alignment until a failure surfaces." },
  },
];


export const SKILL_BY_SLUG: Record<string, SkillEngine> = Object.fromEntries(SKILLS.map((e) => [e.slug, e]));

export function featureKey(slug: string): string {
  return `skill_${slug.replace(/-/g, "_")}`;
}

export function denomIndex(e: SkillEngine): number | null {
  const i = e.factors.findIndex((f) => f.denom);
  return i >= 0 ? i : null;
}
