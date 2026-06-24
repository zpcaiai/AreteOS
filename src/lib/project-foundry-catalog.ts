// Project Foundry catalog: a composable map from the existing Arete engines to
// shippable product capabilities. This file is deliberately pure data so the
// catalog can later power a CLI/scaffolder as well as the in-app planner.

export type FoundryCategory =
  | "discovery"
  | "experience"
  | "intelligence"
  | "growth"
  | "organization"
  | "safety"
  | "platform";

export type ProjectType =
  | "personal"
  | "learning"
  | "creator"
  | "founder"
  | "team"
  | "wellbeing"
  | "family"
  | "research";

export interface FoundryFeature {
  id: string;
  category: FoundryCategory;
  name: { zh: string; en: string };
  summary: { zh: string; en: string };
  source: string;
  effort: "S" | "M" | "L";
  dependencies?: string[];
  sensitive?: boolean;
}

export interface StarterPack {
  id: ProjectType;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  featureIds: string[];
}

/** A ready-to-edit business workspace. Unlike a starter pack it includes the
 * first user, problem, and operating constraints, so no blank brief is needed. */
export interface WorkspaceTemplate {
  id: string;
  category: WorkspaceTemplateCategory;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  projectType: ProjectType;
  title: string;
  problem: string;
  audience: string;
  constraints: string;
  featureIds: string[];
}

export type WorkspaceTemplateCategory =
  | "software"
  | "professional"
  | "commerce"
  | "industry"
  | "education"
  | "platform"
  | "local"
  | "organization"
  | "personal"
  | "care";

export const WORKSPACE_TEMPLATE_CATEGORIES: Record<WorkspaceTemplateCategory, { zh: string; en: string }> = {
  software: { zh: "软件与 AI", en: "Software & AI" },
  professional: { zh: "专业服务", en: "Professional services" },
  commerce: { zh: "零售与商业", en: "Commerce & retail" },
  industry: { zh: "制造与供应链", en: "Industry & supply chain" },
  education: { zh: "教育与内容", en: "Education & content" },
  platform: { zh: "平台与社群", en: "Platforms & communities" },
  local: { zh: "本地与空间服务", en: "Local & space services" },
  organization: { zh: "组织与团队", en: "Organizations & teams" },
  personal: { zh: "个人", en: "Personal" },
  care: { zh: "关怀支持", en: "Care support" },
};

export const FOUNDRY_CATEGORIES: Record<FoundryCategory, { zh: string; en: string }> = {
  discovery: { zh: "发现与验证", en: "Discovery & validation" },
  experience: { zh: "体验与行动", en: "Experience & action" },
  intelligence: { zh: "智能与知识", en: "Intelligence & knowledge" },
  growth: { zh: "增长与商业", en: "Growth & business" },
  organization: { zh: "组织与协作", en: "Organization & collaboration" },
  safety: { zh: "安全与信任", en: "Safety & trust" },
  platform: { zh: "平台与交付", en: "Platform & delivery" },
};

const f = (
  id: string, category: FoundryCategory, zh: string, en: string, summaryZh: string, summaryEn: string,
  source: string, effort: FoundryFeature["effort"], dependencies?: string[], sensitive?: boolean,
): FoundryFeature => ({ id, category, name: { zh, en }, summary: { zh: summaryZh, en: summaryEn }, source, effort, dependencies, sensitive });

/** Every item is an independently selectable product capability, not a screen. */
export const FOUNDRY_FEATURES: FoundryFeature[] = [
  f("problem-framing", "discovery", "问题定义", "Problem framing", "把模糊想法转成可验证的问题、对象和成功标准。", "Turn a vague idea into a testable problem, audience, and success criteria.", "Bottleneck · First Principles", "S"),
  f("opportunity-scoring", "discovery", "机会评分", "Opportunity scoring", "按需求强度、可达性、可行性和杠杆排序机会。", "Rank opportunities by demand, reachability, feasibility, and leverage.", "Naval Opportunities · Decision Engine", "M", ["problem-framing"]),
  f("validation-experiments", "discovery", "验证实验", "Validation experiments", "用访谈、原型和小实验在投入前验证关键假设。", "Validate key assumptions with interviews, prototypes, and small experiments before investing.", "Experiments · Evidence", "M", ["problem-framing"]),
  f("decision-journal", "discovery", "决策日志", "Decision journal", "记录选项、假设、置信度和复盘日期，避免事后改写。", "Record options, assumptions, confidence, and review dates to prevent hindsight rewriting.", "Decision · Boardroom", "S"),

  f("onboarding-loop", "experience", "引导与首轮闭环", "Onboarding loop", "用少量问题完成画像、目标和第一步行动。", "Create a profile, goal, and first action from a small set of questions.", "Onboarding · Growth Protocol", "M", ["problem-framing"]),
  f("action-protocol", "experience", "行动协议", "Action protocol", "把诊断转为分阶段任务、提醒、复盘和更新。", "Turn diagnosis into staged tasks, reminders, reviews, and updates.", "Growth Protocol · Prescription", "M", ["onboarding-loop"]),
  f("habit-practice", "experience", "习惯与练习", "Habits & practice", "把身份、技能或项目目标转为可追踪的最小行动。", "Turn identity, skill, or project goals into trackable minimum actions.", "Habits · Deep Work · Mastery", "M", ["action-protocol"]),
  f("reflection-review", "experience", "反思与复盘", "Reflection & review", "支持日、周、月复盘，并把教训回写到下一轮计划。", "Support daily, weekly, and monthly review; feed lessons into the next plan.", "Reflection · Reviews", "S", ["action-protocol"]),
  f("progress-dashboard", "experience", "进度指挥台", "Progress dashboard", "汇总最重要指标、下一步和跨模块状态。", "Aggregate vital metrics, next action, and cross-module state.", "Journey · Dashboard", "M", ["action-protocol"]),

  f("ai-coach", "intelligence", "AI 教练", "AI coach", "带记忆、工具调用和安全边界的多轮指导。", "Multi-turn guidance with memory, tool use, and guardrails.", "Coach · Agent Runtime", "L", ["onboarding-loop", "privacy-controls"]),
  f("knowledge-base", "intelligence", "知识库与检索", "Knowledge base & retrieval", "把笔记、决策和资料变成可检索的个人或团队记忆。", "Turn notes, decisions, and sources into searchable personal or team memory.", "Mnemosyne · Personal Memory", "M", ["privacy-controls"]),
  f("decision-support", "intelligence", "决策支持", "Decision support", "以模型、偏差检查、顾问视角和情景模拟提高判断质量。", "Improve judgment with models, bias checks, advisor lenses, and scenarios.", "Phronesis · Boardroom · Twin", "L", ["decision-journal"]),
  f("personalized-plans", "intelligence", "个性化方案编译", "Personalized plan compiler", "将目标与约束编译成技能、节奏、资产和 90 天计划。", "Compile goals and constraints into skills, cadence, assets, and a 90-day plan.", "Personal OS Compiler", "L", ["onboarding-loop", "action-protocol"]),
  f("knowledge-graph", "intelligence", "知识图谱", "Knowledge graph", "连接概念、证据、决策和学习路径，展示缺口与关联。", "Connect concepts, evidence, decisions, and learning paths to reveal gaps and links.", "Neo4j · Graph Insights", "L", ["knowledge-base"]),

  f("asset-pipeline", "growth", "资产生产线", "Asset pipeline", "从想法到发布、反馈、复用和复利的产出流程。", "Move output from idea to publish, feedback, reuse, and compounding.", "Asset-Based Growth", "M", ["action-protocol"]),
  f("portfolio-ledger", "growth", "资本与组合账本", "Capital & portfolio ledger", "追踪时间、知识、关系、健康、金钱等长期资本。", "Track long-term capital across time, knowledge, relationships, health, money, and more.", "Life Capital · Naval", "M", ["reflection-review"]),
  f("membership-billing", "growth", "会员与付费", "Membership & billing", "提供分层权益、订阅周期和可替换的支付回调入口。", "Provide tiered entitlements, subscriptions, and replaceable payment webhooks.", "Membership · Payments", "M", ["auth-roles"]),
  f("community", "growth", "社区与同伴", "Community & peers", "让用户分享成果、找到同伴并获得适度的社会反馈。", "Let users share progress, find peers, and receive proportionate social feedback.", "Agora Community", "L", ["auth-roles", "moderation-safety"]),

  f("team-operating-system", "organization", "团队运行系统", "Team operating system", "把愿景、角色、优先级、决策和节奏统一到可执行的工作方式。", "Align vision, roles, priorities, decisions, and cadence into an executable way of working.", "Praxis · Oikos · Archon", "L", ["auth-roles", "progress-dashboard"]),
  f("learning-studio", "organization", "学习工作室", "Learning studio", "提供技能树、刻意练习、反馈和学习路径。", "Provide skill trees, deliberate practice, feedback, and learning paths.", "Skills Library · Mastery", "L", ["onboarding-loop", "habit-practice"]),
  f("family-space", "organization", "家庭成长空间", "Family growth space", "支持家长、儿童档案、项目式学习与成长支持。", "Support parents, child profiles, project learning, and developmental support.", "Genius Kids", "L", ["auth-roles", "privacy-controls"]),
  f("role-based-workspaces", "organization", "角色工作台", "Role-based workspaces", "让教练、成员、家长、管理者看到各自适合的任务和数据。", "Give coaches, members, parents, and managers the tasks and data appropriate to them.", "Archon · Genius · Admin", "L", ["auth-roles"]),

  f("auth-roles", "safety", "认证与角色权限", "Authentication & roles", "登录、会话、角色和最小权限访问。", "Sign-in, sessions, roles, and least-privilege access.", "Auth · Admin", "M"),
  f("privacy-controls", "safety", "隐私与数据控制", "Privacy & data controls", "明确数据范围、导出、删除和敏感信息边界。", "Define data scope, export, deletion, and sensitive-information boundaries.", "Account · Data Export", "M", ["auth-roles"]),
  f("moderation-safety", "safety", "内容安全与人工升级", "Moderation & human escalation", "为社区、AI 和高风险情境提供边界、求助和升级路径。", "Provide boundaries, support, and escalation paths for community, AI, and high-risk contexts.", "Safety · Healing Support", "L", ["privacy-controls"], true),
  f("wellbeing-safety", "safety", "身心健康安全框架", "Wellbeing safety framework", "以稳定、风险筛查、危机求助和非诊断性语言保护用户。", "Protect users with stabilization, risk screening, crisis support, and non-diagnostic language.", "Healing OS · Safety", "L", ["privacy-controls", "moderation-safety"], true),
  f("audit-history", "safety", "可追溯历史", "Audit history", "保留关键决定、状态变更和版本，让系统可解释、可复盘。", "Keep key decisions, state changes, and versions explainable and reviewable.", "Domain Events · Timeline", "M", ["auth-roles"]),

  f("api-integration", "platform", "API 与集成层", "API & integration layer", "以可验证的 API、webhook 和连接器接入外部系统。", "Connect external systems through validated APIs, webhooks, and connectors.", "REST API · Connectors", "M", ["auth-roles", "audit-history"]),
  f("analytics-observability", "platform", "分析与可观测性", "Analytics & observability", "结合产品指标、结构化日志、错误追踪和健康检查。", "Combine product metrics, structured logs, error tracking, and health checks.", "Analytics · Pino · Sentry", "M", ["audit-history"]),
  f("offline-localization", "platform", "离线与多语言", "Offline & localization", "通过 PWA、缓存和中英双语提升可达性与韧性。", "Improve access and resilience with PWA, caching, and bilingual UX.", "PWA · i18n", "M"),
  f("quality-release", "platform", "质量与发布护栏", "Quality & release guardrails", "类型检查、单元/E2E 测试、迁移和部署检查清单。", "Use type checks, unit/E2E tests, migrations, and a release checklist.", "Vitest · Playwright · Prisma", "M", ["analytics-observability"]),
];

export const STARTER_PACKS: StarterPack[] = [
  { id: "personal", name: { zh: "个人成长教练", en: "Personal growth coach" }, description: { zh: "从目标到行动、复盘与进度的个人闭环。", en: "A personal loop from goal to action, review, and progress." }, featureIds: ["problem-framing", "onboarding-loop", "action-protocol", "habit-practice", "reflection-review", "progress-dashboard", "ai-coach", "privacy-controls", "audit-history"] },
  { id: "learning", name: { zh: "学习与精通工作室", en: "Learning & mastery studio" }, description: { zh: "把学习目标转为练习、反馈与可见成长。", en: "Turn learning goals into practice, feedback, and visible growth." }, featureIds: ["problem-framing", "onboarding-loop", "learning-studio", "habit-practice", "reflection-review", "progress-dashboard", "knowledge-base", "privacy-controls"] },
  { id: "creator", name: { zh: "创作者资产工作台", en: "Creator asset studio" }, description: { zh: "从选题、深度工作到发布和资产复利。", en: "From topic selection and deep work to publishing and compounding assets." }, featureIds: ["problem-framing", "opportunity-scoring", "action-protocol", "asset-pipeline", "portfolio-ledger", "progress-dashboard", "analytics-observability", "privacy-controls"] },
  { id: "founder", name: { zh: "创业验证工作台", en: "Founder validation studio" }, description: { zh: "围绕客户问题、实验和 MVP 节奏构建。", en: "Built around customer problems, experiments, and MVP cadence." }, featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "decision-journal", "action-protocol", "asset-pipeline", "progress-dashboard", "analytics-observability", "quality-release"] },
  { id: "team", name: { zh: "团队运行系统", en: "Team operating system" }, description: { zh: "让目标、角色、决策和组织节奏协同。", en: "Coordinate goals, roles, decisions, and organizational cadence." }, featureIds: ["auth-roles", "role-based-workspaces", "team-operating-system", "decision-support", "progress-dashboard", "reflection-review", "audit-history", "analytics-observability"] },
  { id: "wellbeing", name: { zh: "健康支持伴侣", en: "Wellbeing support companion" }, description: { zh: "非诊断式的自我觉察、调节和求助支持。", en: "Non-diagnostic self-awareness, regulation, and support seeking." }, featureIds: ["onboarding-loop", "ai-coach", "habit-practice", "reflection-review", "wellbeing-safety", "privacy-controls", "audit-history"] },
  { id: "family", name: { zh: "家庭学习与成长", en: "Family learning & growth" }, description: { zh: "为家长和孩子提供成长、项目和支持空间。", en: "A growth, projects, and support space for parents and children." }, featureIds: ["auth-roles", "family-space", "learning-studio", "progress-dashboard", "privacy-controls", "moderation-safety", "audit-history"] },
  { id: "research", name: { zh: "研究与决策工作室", en: "Research & decision studio" }, description: { zh: "整理知识、评估证据并为高质量决策提供支持。", en: "Organize knowledge, assess evidence, and support high-quality decisions." }, featureIds: ["problem-framing", "knowledge-base", "knowledge-graph", "decision-journal", "decision-support", "reflection-review", "audit-history", "analytics-observability"] },
];

/**
 * Opinionated starting points for the most common ways people use Arete.
 * They intentionally cover the whole capability catalog; users can change any
 * field or module after applying one.
 */
export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    id: "personal-90-day-reset", category: "personal", projectType: "personal",
    name: { zh: "90 天个人成长计划", en: "90-day personal growth plan" },
    description: { zh: "把一个重要改变拆成稳定的日常行动与每周复盘。", en: "Turn one meaningful change into daily actions and weekly review." },
    title: "我的 90 天成长工作区", audience: "希望重新建立稳定节奏、并持续看到进展的个人用户",
    problem: "用户知道自己想改变，却难以把长期目标转成每天能开始的小行动，也缺少回顾和调整的机制。",
    constraints: "每天 15 分钟；每周一次 30 分钟复盘；只追踪一个核心改变。",
    featureIds: ["problem-framing", "onboarding-loop", "action-protocol", "habit-practice", "reflection-review", "progress-dashboard", "personalized-plans", "ai-coach", "privacy-controls", "audit-history"],
  },
  {
    id: "exam-mastery", category: "personal", projectType: "learning",
    name: { zh: "考试 / 技能精通", en: "Exam & skill mastery" },
    description: { zh: "为考试、语言或职业技能建立练习—反馈—复盘闭环。", en: "Create a practice, feedback, and review loop for exams or skills." },
    title: "技能精通学习工作区", audience: "准备重要考试或在 8–12 周内掌握一项职业技能的学习者",
    problem: "学习者有资料和目标，但练习不连续、不会根据薄弱点调整，也看不清真实掌握程度。",
    constraints: "每周 5 次 25 分钟练习；每周一次错题与策略复盘；不要求导入既有资料。",
    featureIds: ["problem-framing", "onboarding-loop", "learning-studio", "habit-practice", "reflection-review", "progress-dashboard", "knowledge-base", "privacy-controls"],
  },
  {
    id: "creator-content-engine", category: "professional", projectType: "creator",
    name: { zh: "内容创作者增长引擎", en: "Creator content engine" },
    description: { zh: "从选题、创作到发布和资产复用的一人工作室。", en: "A one-person studio from ideas to publishing and reuse." },
    title: "创作者内容资产工作区", audience: "希望稳定输出并沉淀可复用内容资产的独立创作者",
    problem: "创作者在选题、完成和复用之间反复切换，内容产出不可预测，也无法判断哪些主题值得持续投入。",
    constraints: "每周发布 1 个核心内容；只维护一个渠道；每月复盘一次内容资产。",
    featureIds: ["problem-framing", "opportunity-scoring", "action-protocol", "asset-pipeline", "portfolio-ledger", "progress-dashboard", "analytics-observability", "privacy-controls"],
  },
  {
    id: "paid-course-community", category: "education", projectType: "creator",
    name: { zh: "付费课程与社群", en: "Paid course & community" },
    description: { zh: "用于验证课程、交付学习体验并经营小型会员社群。", en: "Validate a course, deliver learning, and run a small member community." },
    title: "付费课程与社群工作区", audience: "拥有明确专业主题、准备服务首批 30–100 名付费学员的创作者",
    problem: "创作者需要在大量录课前验证主题，并为学员提供有节奏的学习、反馈和社群支持。",
    constraints: "先用 4 周小班试点；首期不超过 30 人；仅提供一种付费方案。",
    featureIds: ["problem-framing", "validation-experiments", "onboarding-loop", "learning-studio", "community", "membership-billing", "moderation-safety", "offline-localization", "analytics-observability", "quality-release"],
  },
  {
    id: "b2b-mvp-validation", category: "software", projectType: "founder",
    name: { zh: "B2B SaaS MVP 验证", en: "B2B SaaS MVP validation" },
    description: { zh: "把客户访谈转成一个可试用、可决策的 MVP。", en: "Turn customer interviews into a testable, decision-ready MVP." },
    title: "B2B SaaS 验证工作区", audience: "面向某个具体工作流、尚未找到产品市场匹配的早期 B2B 创始人",
    problem: "团队收集了零散客户反馈，却无法确定最痛的工作流、验证付费意愿，并在有限时间内交付一条可试用路径。",
    constraints: "两人团队、6 周；完成 10 次客户访谈；第一版只支持一个角色和一个核心任务。",
    featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "decision-journal", "action-protocol", "progress-dashboard", "analytics-observability", "quality-release"],
  },
  {
    id: "consulting-client-delivery", category: "professional", projectType: "founder",
    name: { zh: "咨询 / 服务交付", en: "Consulting delivery" },
    description: { zh: "把客户诊断、方案、交付与复盘放进可复制的服务工作流。", en: "Make diagnosis, delivery, and review a repeatable client-service workflow." },
    title: "咨询客户交付工作区", audience: "为 5–20 家客户持续提供专业服务的小型咨询或代理团队",
    problem: "服务质量依赖个人经验，客户目标、关键决策和交付状态分散，团队难以复用方法并及时沟通风险。",
    constraints: "先标准化一种服务包；每个客户只看一张项目状态页；客户数据按最小权限访问。",
    featureIds: ["problem-framing", "onboarding-loop", "action-protocol", "role-based-workspaces", "decision-support", "api-integration", "auth-roles", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "team-execution", category: "organization", projectType: "team",
    name: { zh: "团队目标与执行", en: "Team goals & execution" },
    description: { zh: "为小团队统一优先级、角色、决策和复盘节奏。", en: "Align priorities, roles, decisions, and review rhythm for a small team." },
    title: "团队执行工作区", audience: "需要跨职能协作、但目标与决策经常失焦的 5–30 人团队",
    problem: "团队会议很多但决定无法落地，优先级和责任人不清晰，复盘也没有回到下一轮计划。",
    constraints: "一个季度只维护 3 个团队目标；每周 30 分钟运营会议；所有关键决策必须记录。",
    featureIds: ["auth-roles", "role-based-workspaces", "team-operating-system", "decision-journal", "decision-support", "progress-dashboard", "reflection-review", "audit-history", "analytics-observability"],
  },
  {
    id: "manager-development", category: "organization", projectType: "team",
    name: { zh: "管理者成长与 1:1", en: "Manager development & 1:1s" },
    description: { zh: "帮助管理者把反馈、判断和团队健康变成稳定习惯。", en: "Help managers build reliable habits around feedback, judgment, and team health." },
    title: "管理者成长工作区", audience: "第一次或正在成长中的团队管理者，以及他们直接带领的成员",
    problem: "管理者忙于即时问题，1:1 缺少连续性，重要决策与团队信号无法被看见和复盘。",
    constraints: "每位成员每两周一次 1:1；只记录工作相关的最少信息；每月一次管理复盘。",
    featureIds: ["onboarding-loop", "habit-practice", "reflection-review", "decision-support", "team-operating-system", "role-based-workspaces", "privacy-controls", "audit-history"],
  },
  {
    id: "wellbeing-companion", category: "care", projectType: "wellbeing",
    name: { zh: "身心健康支持伴侣", en: "Wellbeing support companion" },
    description: { zh: "以非诊断方式支持自我觉察、稳定与求助。", en: "Support self-awareness, stabilization, and help-seeking without diagnosis." },
    title: "日常身心支持工作区", audience: "希望建立情绪觉察、调节和日常支持节奏的成年用户",
    problem: "用户在压力上升时难以觉察并使用已有工具，需要简短、可持续的稳定练习和明确的求助边界。",
    constraints: "非医疗诊断；不处理紧急危机；每次练习不超过 10 分钟，并始终提供人工/紧急求助提示。",
    featureIds: ["onboarding-loop", "ai-coach", "habit-practice", "reflection-review", "wellbeing-safety", "moderation-safety", "privacy-controls", "audit-history"],
  },
  {
    id: "family-learning", category: "education", projectType: "family",
    name: { zh: "家庭学习与成长", en: "Family learning & growth" },
    description: { zh: "给家长和孩子一套低压力的项目学习与支持空间。", en: "A low-pressure project-learning and support space for families." },
    title: "家庭学习成长工作区", audience: "希望和 6–16 岁孩子一起完成小项目、并看见成长过程的家庭",
    problem: "家庭学习容易变成催促与打卡，家长缺少适龄目标、项目节奏和清晰的隐私边界。",
    constraints: "儿童信息最小化；家长管理权限；以项目和过程反馈为主，不做能力诊断或排名。",
    featureIds: ["auth-roles", "family-space", "learning-studio", "habit-practice", "progress-dashboard", "privacy-controls", "moderation-safety", "audit-history"],
  },
  {
    id: "research-decision-lab", category: "professional", projectType: "research",
    name: { zh: "研究与决策实验室", en: "Research & decision lab" },
    description: { zh: "整理证据、假设与决策，避免研究工作停在资料堆里。", en: "Connect evidence, hypotheses, and decisions so research does not remain a pile of notes." },
    title: "研究与决策工作区", audience: "需要基于文献、数据或访谈形成可追溯判断的研究者和策略团队",
    problem: "资料、证据强度和关键假设分散，团队难以从阅读走向可审计的结论与下一步实验。",
    constraints: "每项结论必须链接来源；记录置信度与复核日期；不把未验证推断当作事实。",
    featureIds: ["problem-framing", "knowledge-base", "knowledge-graph", "decision-journal", "decision-support", "validation-experiments", "reflection-review", "audit-history", "analytics-observability"],
  },
  {
    id: "member-community", category: "platform", projectType: "team",
    name: { zh: "会员社群运营", en: "Member community operations" },
    description: { zh: "为小型专业社群配置入群、价值交付、治理与数据闭环。", en: "Set up onboarding, value delivery, governance, and metrics for a professional community." },
    title: "会员社群运营工作区", audience: "运营 100–1,000 名专业成员、需要提高激活和留存的社群团队",
    problem: "新成员不知道如何获得价值，运营团队难以识别高质量互动和风险内容，也无法将反馈用于迭代。",
    constraints: "先服务一个明确细分人群；设定社区规则和人工升级路径；每月只跟踪 3 个运营指标。",
    featureIds: ["auth-roles", "onboarding-loop", "community", "membership-billing", "role-based-workspaces", "moderation-safety", "privacy-controls", "analytics-observability", "quality-release"],
  },
  {
    id: "ai-product-copilot", category: "software", projectType: "founder",
    name: { zh: "AI 产品 / 行业 Copilot", en: "AI product / vertical copilot" },
    description: { zh: "围绕一个高频任务，验证 AI 是否真的节省时间并建立可信边界。", en: "Validate whether AI saves time on one frequent task with trustworthy boundaries." },
    title: "AI 产品验证工作区", audience: "为某一类专业用户解决重复、信息密集任务的 AI 产品团队",
    problem: "团队已有模型能力，却尚未验证哪个任务值得自动化、用户如何校对结果，以及何时必须转交人工处理。",
    constraints: "先支持一种任务和一种输入来源；保留人工确认；不将模型输出视为专业结论；6 周内完成试点。",
    featureIds: ["problem-framing", "validation-experiments", "onboarding-loop", "ai-coach", "knowledge-base", "privacy-controls", "audit-history", "analytics-observability", "quality-release"],
  },
  {
    id: "developer-tool", category: "software", projectType: "founder",
    name: { zh: "开发者工具 / API 产品", en: "Developer tool / API product" },
    description: { zh: "为开发者工作流验证一个可集成、可观测的窄切口工具。", en: "Validate a narrow, integrable, observable tool for a developer workflow." },
    title: "开发者工具工作区", audience: "在特定工程流程中反复遇到效率或可靠性问题的软件开发团队",
    problem: "开发者工具功能设想很多，但团队不清楚哪个集成点最痛，也缺少可衡量的激活与留存信号。",
    constraints: "先支持一个框架和一个集成方式；提供清晰错误信息；首版只跟踪安装、首次成功与一周复用。",
    featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "api-integration", "knowledge-base", "auth-roles", "analytics-observability", "quality-release"],
  },
  {
    id: "ecommerce-dtc", category: "commerce", projectType: "founder",
    name: { zh: "电商 DTC 品牌运营", en: "DTC ecommerce operations" },
    description: { zh: "从商品机会、内容转化到复购指标的一体化经营工作区。", en: "Operate product opportunity, content conversion, and repeat purchase in one workspace." },
    title: "DTC 电商增长工作区", audience: "经营一个核心品类、希望提升转化与复购的中小品牌团队",
    problem: "商品、内容和用户反馈分散，团队难以判断该优化哪个页面、活动或复购触点。",
    constraints: "先聚焦一个主力商品和一个渠道；每两周一次实验；不把单次活动数据当成长期趋势。",
    featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "asset-pipeline", "portfolio-ledger", "membership-billing", "analytics-observability", "quality-release"],
  },
  {
    id: "retail-chain-operations", category: "commerce", projectType: "team",
    name: { zh: "连锁零售门店运营", en: "Retail chain operations" },
    description: { zh: "让总部目标、门店任务、异常反馈和复盘形成轻量闭环。", en: "Connect headquarters goals, store tasks, exceptions, and reviews in a lightweight loop." },
    title: "连锁门店运营工作区", audience: "管理 3–50 家门店、需要统一执行和经验回流的零售运营团队",
    problem: "总部活动和门店执行脱节，异常只能靠群聊发现，优秀门店的做法无法快速复制。",
    constraints: "门店只填写必要状态；每周一次经营复盘；先覆盖一个核心运营流程。",
    featureIds: ["auth-roles", "role-based-workspaces", "team-operating-system", "action-protocol", "reflection-review", "progress-dashboard", "analytics-observability", "offline-localization"],
  },
  {
    id: "wholesale-distribution", category: "commerce", projectType: "team",
    name: { zh: "批发与渠道分销", en: "Wholesale & channel distribution" },
    description: { zh: "管理渠道机会、关键客户和可追溯的销售决策。", en: "Manage channel opportunities, key accounts, and traceable sales decisions." },
    title: "渠道分销工作区", audience: "依赖经销商或大客户、需要协调销售与供货节奏的贸易团队",
    problem: "渠道机会、报价判断和客户承诺各自分散，团队无法及时识别风险与可复制的赢单路径。",
    constraints: "只服务一个重点渠道类型；关键报价必须记录假设；每月复盘前三大机会。",
    featureIds: ["problem-framing", "decision-journal", "decision-support", "role-based-workspaces", "api-integration", "audit-history", "analytics-observability"],
  },
  {
    id: "manufacturing-operations", category: "industry", projectType: "team",
    name: { zh: "制造现场与改善", en: "Manufacturing operations" },
    description: { zh: "为一个产线或工序建立异常、改善行动和经验复盘的可视工作台。", en: "Create a visible workspace for exceptions, improvement actions, and learning on one line or process." },
    title: "制造运营改善工作区", audience: "需要降低返工、等待或质量波动的生产、质量和设备协作团队",
    problem: "现场异常记录不完整，改善事项无人持续跟进，班组经验难以沉淀为下一轮标准作业。",
    constraints: "先选一个产线或工序；不替代现有 MES/质量体系；每周复盘一个主要损失点。",
    featureIds: ["problem-framing", "action-protocol", "team-operating-system", "reflection-review", "knowledge-base", "api-integration", "audit-history", "analytics-observability"],
  },
  {
    id: "supply-chain-logistics", category: "industry", projectType: "team",
    name: { zh: "供应链与物流协同", en: "Supply chain & logistics" },
    description: { zh: "把缺货、延误和跨方协调变成可追踪的例外处理流程。", en: "Turn stockouts, delays, and cross-party coordination into a traceable exception workflow." },
    title: "供应链物流协同工作区", audience: "协调采购、仓储、运输和客户承诺的供应链运营团队",
    problem: "风险通常在客户投诉后才暴露，跨部门处理没有统一事实、责任人与决策记录。",
    constraints: "首版只管理高价值或高风险订单；用现有数据源；每周查看异常解决时长。",
    featureIds: ["problem-framing", "decision-journal", "role-based-workspaces", "action-protocol", "api-integration", "audit-history", "analytics-observability"],
  },
  {
    id: "agency-client-growth", category: "professional", projectType: "team",
    name: { zh: "代理服务与客户增长", en: "Agency client growth" },
    description: { zh: "适用于品牌、广告、设计和数字营销代理服务的客户经营与交付。", en: "Run client growth and delivery for branding, advertising, design, or digital agencies." },
    title: "代理服务客户工作区", audience: "同时服务多个客户、需要减少返工并提升续约质量的代理服务团队",
    problem: "客户需求、策略假设、创意交付和结果回顾分散，团队易陷入救火而非可复制的增长服务。",
    constraints: "先标准化一个服务线；每个客户只保留一个核心业务目标；每月进行结果与范围复盘。",
    featureIds: ["onboarding-loop", "problem-framing", "action-protocol", "asset-pipeline", "decision-journal", "role-based-workspaces", "analytics-observability", "audit-history"],
  },
  {
    id: "enterprise-automation", category: "software", projectType: "founder",
    name: { zh: "企业自动化 / 内部工具", en: "Enterprise automation / internal tools" },
    description: { zh: "为一个内部审批、协作或信息流减少重复操作。", en: "Reduce repeat work in one internal approval, collaboration, or information flow." },
    title: "企业流程自动化工作区", audience: "在跨部门流程中承受重复录入、等待和信息断裂的企业运营团队",
    problem: "改造需求很大但真实瓶颈不清，自动化容易放大错误，且缺少权限、审计和异常处理边界。",
    constraints: "先自动化一个低风险流程；保留人工兜底；接入最少系统；所有状态变更可审计。",
    featureIds: ["problem-framing", "validation-experiments", "role-based-workspaces", "api-integration", "auth-roles", "privacy-controls", "audit-history", "quality-release"],
  },
  {
    id: "education-institution", category: "education", projectType: "learning",
    name: { zh: "教育机构与教研运营", en: "Education institution operations" },
    description: { zh: "为课程、教师协作和学员进展建立可调整的教学运营闭环。", en: "Create an adaptable teaching-operations loop for courses, teachers, and learners." },
    title: "教育机构教学运营工作区", audience: "管理多个班级或教师、希望提高学习完成和教学协同的教育团队",
    problem: "课程目标、学员参与和教师反馈无法汇总，教研改进没有持续依据，家校/学员沟通易失焦。",
    constraints: "先覆盖一个课程产品；只采集必要学习信息；每期课程结束进行一次教研复盘。",
    featureIds: ["onboarding-loop", "learning-studio", "role-based-workspaces", "reflection-review", "progress-dashboard", "privacy-controls", "analytics-observability"],
  },
  {
    id: "marketplace-platform", category: "platform", projectType: "founder",
    name: { zh: "双边平台 / 交易市场", en: "Two-sided marketplace" },
    description: { zh: "从一侧供给和一个高频需求场景开始验证平台流动性。", en: "Validate marketplace liquidity from one supply side and one frequent demand case." },
    title: "双边平台验证工作区", audience: "连接服务供给者与明确需求方、尚处于冷启动阶段的平台创业团队",
    problem: "团队同时追求供给、需求和功能，无法验证最初的撮合为何发生，也没有治理与信任的最小机制。",
    constraints: "先限定一个城市或垂类；人工撮合优先；不做复杂定价；明确纠纷和举报升级路径。",
    featureIds: ["problem-framing", "validation-experiments", "onboarding-loop", "community", "membership-billing", "moderation-safety", "analytics-observability", "quality-release"],
  },
  {
    id: "property-space-service", category: "local", projectType: "team",
    name: { zh: "空间服务 / 物业运营", en: "Space service / property operations" },
    description: { zh: "管理报修、巡检、租户沟通和服务改进的本地运营工作区。", en: "Manage maintenance, inspections, tenant communication, and service improvement." },
    title: "空间服务运营工作区", audience: "管理写字楼、园区、商场或长租空间的物业与客户服务团队",
    problem: "服务请求、现场处理和租户反馈无法形成统一闭环，管理者难以识别反复发生的体验问题。",
    constraints: "先覆盖一个空间或服务类型；服务人员移动端可用；不存放非必要个人信息。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "reflection-review", "progress-dashboard", "privacy-controls", "offline-localization", "analytics-observability"],
  },
  {
    id: "hospitality-operations", category: "local", projectType: "team",
    name: { zh: "酒店与住宿服务", en: "Hospitality operations" },
    description: { zh: "把客诉、服务恢复、班组协作和体验复盘放到同一节奏中。", en: "Bring guest issues, service recovery, shift coordination, and experience review into one rhythm." },
    title: "住宿服务运营工作区", audience: "运营精品酒店、民宿品牌或服务式公寓的前台、客房和运营团队",
    problem: "客人反馈和现场问题难以交接，服务恢复依赖个人经验，重复问题无法转化为流程改善。",
    constraints: "先覆盖一个门店；保护客人隐私；每日交班只记录可行动事项；每周复盘前三类问题。",
    featureIds: ["action-protocol", "role-based-workspaces", "team-operating-system", "reflection-review", "privacy-controls", "offline-localization", "analytics-observability"],
  },
  {
    id: "restaurant-chain", category: "local", projectType: "team",
    name: { zh: "餐饮门店与连锁", en: "Restaurant & chain operations" },
    description: { zh: "围绕出品、服务、损耗和门店改善建立日常执行闭环。", en: "Build a daily execution loop around quality, service, waste, and store improvement." },
    title: "餐饮门店运营工作区", audience: "管理单店或小型连锁、需要稳定出品与服务体验的餐饮团队",
    problem: "高峰期问题记录不完整，人员交接和损耗改善依靠口头经验，管理者看不到最值得先解决的事项。",
    constraints: "每班只记录关键异常；先优化一个门店流程；不把系统用于员工绩效排名。",
    featureIds: ["action-protocol", "habit-practice", "role-based-workspaces", "reflection-review", "progress-dashboard", "offline-localization", "analytics-observability"],
  },
  {
    id: "fitness-wellness-studio", category: "local", projectType: "wellbeing",
    name: { zh: "健身 / 健康空间服务", en: "Fitness & wellness studio" },
    description: { zh: "为会员旅程、教练服务与留存改善提供非诊断式运营工作区。", en: "Operate member journeys, coach service, and retention improvements without diagnosis." },
    title: "健康空间服务工作区", audience: "经营健身、瑜伽、康复训练或健康生活方式空间的服务团队",
    problem: "新会员开始后很快流失，教练服务节奏不一致，团队看不到哪些触点真正带来持续参与。",
    constraints: "不提供医疗诊断；仅追踪服务参与与目标进展；每月复盘新会员前 30 天体验。",
    featureIds: ["onboarding-loop", "habit-practice", "action-protocol", "role-based-workspaces", "membership-billing", "privacy-controls", "analytics-observability"],
  },
  {
    id: "startup-operating-system", category: "organization", projectType: "team",
    name: { zh: "创业团队运行系统", en: "Startup team operating system" },
    description: { zh: "在资源有限时统一假设、优先级、融资/增长决策和周节奏。", en: "Align hypotheses, priorities, growth decisions, and weekly rhythm under tight resources." },
    title: "创业团队工作区", audience: "3–20 人、产品与市场仍在快速调整中的早期创业团队",
    problem: "创始人判断和团队执行脱节，实验结论不被记录，团队在紧急事务中失去对最关键假设的关注。",
    constraints: "每周只承诺三件最重要的事；每个实验设定继续/停止门槛；决策可被复盘。",
    featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "decision-journal", "team-operating-system", "progress-dashboard", "reflection-review", "analytics-observability"],
  },
  {
    id: "hr-recruiting", category: "professional", projectType: "team",
    name: { zh: "招聘与人才运营", en: "Recruiting & talent operations" },
    description: { zh: "让岗位需求、候选人流程、面试判断和入职反馈更一致、可复盘。", en: "Make role needs, candidate flow, interview judgment, and onboarding feedback consistent and reviewable." },
    title: "招聘人才运营工作区", audience: "需要持续招聘关键岗位、并协调业务负责人和招聘团队的成长型公司",
    problem: "岗位标准模糊、面试信息不可比较、招聘决策缺少记录，入职后的反馈也无法反哺招聘质量。",
    constraints: "遵循最小必要数据原则；不自动做录用决定；每个岗位只保留明确的胜任标准和面试证据。",
    featureIds: ["problem-framing", "onboarding-loop", "decision-journal", "role-based-workspaces", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "professional-firm-knowledge", category: "professional", projectType: "research",
    name: { zh: "律所 / 会计 / 专业事务所", en: "Professional firm knowledge" },
    description: { zh: "沉淀客户服务方法、研究证据和项目复盘，不替代专业判断。", en: "Capture service methods, research evidence, and project review without replacing professional judgment." },
    title: "专业事务所知识工作区", audience: "希望复用专业经验、提升项目交付一致性的律师、会计、税务或顾问团队",
    problem: "专业知识依赖个人记忆，项目经验无法检索，关键判断与客户边界没有形成可追溯的团队资产。",
    constraints: "不自动提供法律、税务或财务结论；客户信息分级；每个可复用结论保留来源与复核人。",
    featureIds: ["knowledge-base", "knowledge-graph", "decision-journal", "role-based-workspaces", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "nonprofit-program", category: "organization", projectType: "team",
    name: { zh: "公益项目与志愿者协作", en: "Nonprofit programs & volunteers" },
    description: { zh: "让受益目标、项目执行、志愿者协作和影响复盘保持在一条线上。", en: "Keep beneficiary outcomes, program delivery, volunteer coordination, and impact review connected." },
    title: "公益项目运营工作区", audience: "需要协调项目人员、志愿者和合作方的小型公益或社会创新组织",
    problem: "项目活动很多但目标与证据不清，志愿者经验无法沉淀，团队难以用有限资源判断什么真正产生影响。",
    constraints: "只追踪与项目目标直接相关的最少数据；受益人信息保护优先；每期项目有明确复盘。",
    featureIds: ["problem-framing", "action-protocol", "role-based-workspaces", "reflection-review", "knowledge-base", "privacy-controls", "analytics-observability"],
  },
  {
    id: "saas-customer-success", category: "software", projectType: "team",
    name: { zh: "SaaS 客户成功与续约", en: "SaaS customer success & renewal" },
    description: { zh: "围绕客户价值实现、风险信号和续约决策建立经营节奏。", en: "Operate value realization, risk signals, and renewal decisions in one rhythm." },
    title: "SaaS 客户成功工作区", audience: "服务中小企业客户、希望提升激活、留存与续约的 B2B SaaS 团队",
    problem: "客户上线后缺少价值里程碑，风险信号散落在各系统，续约讨论往往在到期前才开始。",
    constraints: "先聚焦一个客户分层；只跟踪可行动健康信号；不将自动评分当作唯一客户判断。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "decision-support", "api-integration", "audit-history", "analytics-observability"],
  },
  {
    id: "b2b-key-account", category: "professional", projectType: "team",
    name: { zh: "B2B 大客户经营", en: "B2B key account management" },
    description: { zh: "统一客户机会、关系地图、承诺事项和跨部门推进节奏。", en: "Unify account opportunities, relationship context, commitments, and cross-functional progress." },
    title: "大客户经营工作区", audience: "依赖少数关键企业客户、需要销售与交付共同经营的 B2B 团队",
    problem: "客户关系与承诺分散在个人手中，跨部门推进没有共同判断，关键机会常因内部协作失速。",
    constraints: "每个客户只维护一个共同业务目标；关键承诺须有责任人和复核日期；保护客户商业信息。",
    featureIds: ["problem-framing", "decision-journal", "role-based-workspaces", "team-operating-system", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "construction-project", category: "industry", projectType: "team",
    name: { zh: "工程建设项目协同", en: "Construction project coordination" },
    description: { zh: "为进度、现场问题、变更与多方协作建立可追踪的项目节奏。", en: "Create a traceable rhythm for schedule, site issues, changes, and multi-party coordination." },
    title: "工程项目协同工作区", audience: "需要协调业主、设计、施工与供应商的中小型工程项目团队",
    problem: "现场问题、变更和责任归属常靠即时沟通，关键假设与决定没有被保留，导致返工和进度失控。",
    constraints: "先管理一个项目的关键里程碑；不替代合规或安全体系；所有变更保留决定依据与责任人。",
    featureIds: ["action-protocol", "decision-journal", "role-based-workspaces", "team-operating-system", "audit-history", "analytics-observability", "offline-localization"],
  },
  {
    id: "franchise-operations", category: "commerce", projectType: "team",
    name: { zh: "加盟连锁运营", en: "Franchise operations" },
    description: { zh: "把总部标准、加盟支持、门店反馈和经验复制连成闭环。", en: "Connect head-office standards, franchise support, store feedback, and repeatable learning." },
    title: "加盟连锁运营工作区", audience: "需要帮助加盟门店稳定执行并收集一线反馈的连锁品牌总部团队",
    problem: "总部标准下发后缺少执行证据，门店需求只能零散反馈，优秀实践无法快速变成全网可用的方法。",
    constraints: "先覆盖一个经营主题；门店填写最少字段；每月从反馈中选一项标准做版本更新。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "knowledge-base", "reflection-review", "progress-dashboard", "analytics-observability"],
  },
  {
    id: "automotive-aftersales", category: "local", projectType: "team",
    name: { zh: "汽车销售与售后服务", en: "Automotive sales & aftersales" },
    description: { zh: "连接预约、服务交付、客户回访与门店改善的服务工作区。", en: "Connect bookings, service delivery, follow-up, and store improvement." },
    title: "汽车售后服务工作区", audience: "经营汽车经销、维修或连锁服务网点的客户服务与运营团队",
    problem: "预约承诺、车辆服务进度和客户回访断裂，门店无法识别反复导致不满意的服务节点。",
    constraints: "先聚焦售后服务；不存放非必要车辆与个人数据；每日处理重点异常，每周复盘服务体验。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "reflection-review", "privacy-controls", "analytics-observability", "offline-localization"],
  },
  {
    id: "clinic-service-operations", category: "local", projectType: "team",
    name: { zh: "诊所 / 医疗服务运营", en: "Clinic service operations" },
    description: { zh: "用于预约、服务体验和非临床运营改善，不涉及诊断或治疗决定。", en: "Improve booking, service experience, and non-clinical operations; not diagnosis or treatment." },
    title: "诊所服务运营工作区", audience: "希望改善预约、候诊、服务交接与患者体验的医疗服务运营团队",
    problem: "服务等待、沟通和现场交接问题难以被系统识别，改善行动没有持续跟进，体验反馈无法回到流程。",
    constraints: "绝不用于诊断、治疗或分诊；健康数据最小化并遵守适用法规；保留人工服务和紧急流程。",
    featureIds: ["action-protocol", "role-based-workspaces", "reflection-review", "privacy-controls", "audit-history", "analytics-observability", "offline-localization"],
  },
  {
    id: "beauty-service-chain", category: "local", projectType: "team",
    name: { zh: "美业 / 宠物服务连锁", en: "Beauty & pet service chain" },
    description: { zh: "支持预约服务、员工协作、会员复访和门店体验改善。", en: "Support booking, staff coordination, member return visits, and store-experience improvement." },
    title: "生活服务连锁工作区", audience: "运营美容、美发、美甲、宠物护理等预约型本地服务门店的团队",
    problem: "顾客偏好、服务交接和回访依赖个人记忆，门店难以统一服务体验或识别可提升复访的环节。",
    constraints: "先覆盖一个服务品类；仅记录必要偏好；每月复盘新客首次体验和回访率。",
    featureIds: ["onboarding-loop", "action-protocol", "habit-practice", "membership-billing", "role-based-workspaces", "privacy-controls", "analytics-observability"],
  },
  {
    id: "events-exhibitions", category: "local", projectType: "team",
    name: { zh: "活动 / 会展项目运营", en: "Events & exhibitions operations" },
    description: { zh: "让招商、内容、现场执行和复盘在单个活动项目中协同。", en: "Coordinate sponsors, content, on-site delivery, and review for a single event project." },
    title: "活动会展项目工作区", audience: "组织会议、展览、品牌活动或节庆项目的策划与现场运营团队",
    problem: "活动事项跨团队、跨供应商且不断变化，现场经验难沉淀，下一次仍要从头解决同类问题。",
    constraints: "一次只管理一个活动；按里程碑处理风险；活动结束一周内完成复盘和供应商经验记录。",
    featureIds: ["problem-framing", "action-protocol", "role-based-workspaces", "team-operating-system", "reflection-review", "knowledge-base", "analytics-observability"],
  },
  {
    id: "media-editorial", category: "education", projectType: "creator",
    name: { zh: "媒体编辑部与内容生产", en: "Media editorial & production" },
    description: { zh: "为选题判断、编辑协作、发布节奏和内容资产复用提供工作区。", en: "Support story selection, editorial collaboration, publishing rhythm, and content reuse." },
    title: "媒体内容生产工作区", audience: "需要稳定产出且同时维护质量、时效和读者价值的媒体或内容团队",
    problem: "选题依据、编辑判断和发布反馈分散，团队无法知道哪些内容值得投入，也难积累可复用的报道与制作方法。",
    constraints: "每周只跟踪核心栏目；事实与意见明确区分；每次复盘关注质量和读者价值，不只看流量。",
    featureIds: ["opportunity-scoring", "decision-journal", "asset-pipeline", "knowledge-base", "role-based-workspaces", "reflection-review", "analytics-observability"],
  },
  {
    id: "financial-operations", category: "professional", projectType: "team",
    name: { zh: "财务共享与经营运营", en: "Finance operations" },
    description: { zh: "协调经营数据、月度流程、异常处理与管理复盘，不提供投资建议。", en: "Coordinate operating data, month-end process, exceptions, and management review; not investment advice." },
    title: "财务运营工作区", audience: "需要提升对账、预算协作或经营节奏可见性的中小企业财务与运营团队",
    problem: "财务流程依赖个人经验，异常处理和业务沟通不透明，管理层难以在及时、可追溯的信息上行动。",
    constraints: "不生成投资、税务或会计结论；沿用既有审批权；仅接入必要数据，并保留审计历史。",
    featureIds: ["action-protocol", "decision-journal", "role-based-workspaces", "api-integration", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "travel-service", category: "local", projectType: "team",
    name: { zh: "旅行定制与目的地服务", en: "Travel design & destination service" },
    description: { zh: "为咨询、行程交付、现场支持和客户反馈建立服务闭环。", en: "Create a service loop for inquiry, itinerary delivery, on-trip support, and customer feedback." },
    title: "旅行服务运营工作区", audience: "提供定制旅行、地接或主题体验服务的小型旅游团队",
    problem: "客户偏好、供应商承诺和现场变化信息不一致，服务人员只能临场补救，经验无法沉淀为更好的产品。",
    constraints: "先服务一种旅行产品；不保存非必要证件信息；每次行程结束回收体验反馈与供应商表现。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "knowledge-base", "reflection-review", "privacy-controls", "analytics-observability"],
  },
  {
    id: "home-services-operations", category: "local", projectType: "team",
    name: { zh: "家政与到家服务运营", en: "Home services operations" },
    description: { zh: "为派单、服务交接、客户回访和服务人员支持建立可追踪闭环。", en: "Create a traceable loop for dispatch, handoff, customer follow-up, and worker support." },
    title: "家政到家服务工作区", audience: "管理保洁、保姆、维修、养老陪护等上门服务团队的中小机构",
    problem: "客户需求、服务人员匹配和现场异常依赖人工沟通，服务质量与复访原因无法被稳定记录和改进。",
    constraints: "先覆盖一种服务；只记录履约所需信息；不以自动化系统替代人工安全核验与紧急处置。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "reflection-review", "privacy-controls", "audit-history", "offline-localization", "analytics-observability"],
  },
  {
    id: "small-business-owner", category: "commerce", projectType: "founder",
    name: { zh: "小微企业经营者", en: "Small business owner" },
    description: { zh: "把获客、交付、现金流关注点和每周经营决策收敛到一个工作区。", en: "Bring customer acquisition, delivery, cash-focus signals, and weekly decisions into one workspace." },
    title: "小微企业经营工作区", audience: "由 1–20 人经营、业务依赖老板判断和一线执行的小微企业",
    problem: "经营者同时处理客户、交付和人员事务，缺少一套轻量机制判断哪项业务动作最值得投入并持续复盘。",
    constraints: "每周只追踪三项经营信号；先改善一个获客或交付环节；不替代会计、税务和法定审批。",
    featureIds: ["problem-framing", "opportunity-scoring", "action-protocol", "decision-journal", "asset-pipeline", "portfolio-ledger", "reflection-review", "analytics-observability"],
  },
  {
    id: "small-business-digitalization", category: "commerce", projectType: "team",
    name: { zh: "小微企业数字化起步", en: "Small business digitalization" },
    description: { zh: "从一个重复流程开始，降低门店或办公室的信息断裂和手工等待。", en: "Start with one repeated workflow to reduce handoffs and manual waiting in a small business." },
    title: "小微企业数字化工作区", audience: "依赖表格、聊天记录和口头交接、准备进行首轮数字化的小微企业团队",
    problem: "企业知道需要数字化，却容易一次采购过多系统，未先厘清哪个流程最常出错、最值得标准化。",
    constraints: "选择一个低风险流程；保留线下兜底；先用现有工具和数据；明确访问权限与数据导出方式。",
    featureIds: ["problem-framing", "validation-experiments", "action-protocol", "role-based-workspaces", "privacy-controls", "api-integration", "audit-history", "quality-release"],
  },
  {
    id: "ai-startup-pmf", category: "software", projectType: "founder",
    name: { zh: "AI 创业公司 PMF 验证", en: "AI startup PMF validation" },
    description: { zh: "在模型能力、单位经济性和真实用户价值之间寻找可持续的产品切口。", en: "Find a sustainable product wedge across model capability, unit economics, and real user value." },
    title: "AI 创业公司验证工作区", audience: "正在探索垂直 AI 产品、需要尽快验证付费价值与使用边界的早期 AI 创业团队",
    problem: "团队容易被模型演示效果带动，却没有验证高频任务、可接受错误率、人工协作方式和可持续交付成本。",
    constraints: "一个行业、一个任务、一个付费假设；人工审核默认开启；不处理未获授权的敏感数据；每周与真实用户复盘。",
    featureIds: ["problem-framing", "opportunity-scoring", "validation-experiments", "ai-coach", "knowledge-base", "decision-journal", "privacy-controls", "analytics-observability", "quality-release"],
  },
  {
    id: "ai-startup-evals-governance", category: "software", projectType: "team",
    name: { zh: "AI 创业公司评测与治理", en: "AI startup evaluation & governance" },
    description: { zh: "为上线前评测、人工升级、版本决策和用户信任建立最小治理系统。", en: "Create a minimum governance system for pre-release evaluation, escalation, version decisions, and trust." },
    title: "AI 产品质量治理工作区", audience: "已经有试用用户、需要让产品团队和工程团队共同管理 AI 风险的创业公司",
    problem: "模型版本、失败案例和用户反馈分散，团队无法统一判断是否可发布、何时降级，以及哪些问题必须人工处理。",
    constraints: "先为一个高风险失败模式建立评测集；所有版本有回滚与责任人；不把评测分数当作唯一发布依据。",
    featureIds: ["knowledge-base", "decision-journal", "role-based-workspaces", "moderation-safety", "privacy-controls", "audit-history", "analytics-observability", "quality-release"],
  },
  {
    id: "large-enterprise-strategy-execution", category: "organization", projectType: "team",
    name: { zh: "大型企业战略到执行", en: "Large enterprise strategy execution" },
    description: { zh: "把战略主题、跨部门优先级、关键决策与经营复盘连接起来。", en: "Connect strategic themes, cross-functional priorities, decisions, and operating review." },
    title: "大型企业战略执行工作区", audience: "需要把年度战略转化为跨部门项目与可验证经营节奏的大型企业业务单元",
    problem: "战略语言与一线行动脱节，部门各自优化，风险和资源冲突在高层会议前才集中暴露。",
    constraints: "先聚焦一个战略主题；不替代正式治理与预算流程；只汇总可行动的状态和风险；明确数据分级。",
    featureIds: ["problem-framing", "team-operating-system", "role-based-workspaces", "decision-support", "progress-dashboard", "reflection-review", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "large-enterprise-shared-services", category: "organization", projectType: "team",
    name: { zh: "大型企业共享服务改善", en: "Large enterprise shared services" },
    description: { zh: "针对人力、财务、采购或 IT 服务的一个流程缩短等待并提升体验。", en: "Improve one HR, finance, procurement, or IT service flow to reduce waiting and improve experience." },
    title: "共享服务改善工作区", audience: "服务多个业务单元、需要提升内部服务响应和流程透明度的企业共享服务团队",
    problem: "内部用户不知道请求进度，服务团队难以从重复工单中找出根因，改进事项经常被日常事务淹没。",
    constraints: "先改进一个服务目录项；保留既有授权与合规控制；按服务体验和解决时长复盘，不以个人排名为目的。",
    featureIds: ["onboarding-loop", "action-protocol", "role-based-workspaces", "reflection-review", "api-integration", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "state-owned-enterprise-operations", category: "organization", projectType: "team",
    name: { zh: "国企经营任务与协同", en: "State-owned enterprise operations" },
    description: { zh: "支持经营任务、重点项目、跨部门协同和过程留痕，不替代法定决策程序。", en: "Support operating tasks, priority projects, coordination, and traceability; not statutory decision-making." },
    title: "国企经营协同工作区", audience: "需要推进重点经营任务、项目建设或改革事项的国有企业业务与职能团队",
    problem: "重点任务涉及多层级、多部门和多个时间节点，过程信息分散，责任、风险和关键决定难以持续追踪。",
    constraints: "遵循既有党委会、董事会与授权程序；不自动生成正式决策；权限分级、全程留痕；先选一个重点事项试点。",
    featureIds: ["action-protocol", "role-based-workspaces", "team-operating-system", "decision-journal", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "public-institution-service", category: "organization", projectType: "team",
    name: { zh: "事业单位公共服务项目", en: "Public institution service programs" },
    description: { zh: "为公共服务项目的受理、协同、服务体验和改进闭环提供工作区。", en: "Provide a workspace for intake, coordination, service experience, and improvement in public programs." },
    title: "公共服务项目工作区", audience: "承担教育、科研、文化、医疗服务或公共事务项目的事业单位业务团队",
    problem: "服务对象的需求、内部协同和项目改进信息断裂，团队难以在合规边界内持续改善服务体验与执行质量。",
    constraints: "遵循公开、公平、保密和档案管理要求；不替代行政审批；最小化个人信息；先试点一个服务事项。",
    featureIds: ["problem-framing", "onboarding-loop", "action-protocol", "role-based-workspaces", "reflection-review", "privacy-controls", "audit-history", "analytics-observability"],
  },
  {
    id: "public-institution-research-program", category: "organization", projectType: "research",
    name: { zh: "科研事业单位项目管理", en: "Public research program management" },
    description: { zh: "把课题目标、证据、协作节点和成果复盘组织为可追溯研究工作区。", en: "Organize research goals, evidence, collaboration milestones, and output review into a traceable workspace." },
    title: "科研项目协同工作区", audience: "承担多方协作课题、需要沉淀研究过程与项目节点的高校、院所或事业单位团队",
    problem: "课题资料、研究判断和协作进度散落在不同成员处，项目管理只在节点临近时集中处理，经验难以复用。",
    constraints: "遵守科研伦理、数据管理和成果署名规则；不替代学术评审；每个关键结论保留来源与复核记录。",
    featureIds: ["problem-framing", "knowledge-base", "knowledge-graph", "decision-journal", "role-based-workspaces", "audit-history", "analytics-observability"],
  },
];

export const FEATURE_BY_ID = Object.fromEntries(FOUNDRY_FEATURES.map((feature) => [feature.id, feature]));
