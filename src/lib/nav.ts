import type { DictKey } from "./i18n/dictionaries";

export type NavItem = { href: string; label: string; labelKey?: DictKey };
/** Progressive-disclosure modes: keep the daily loop narrow; the full library is one click away. */
export type NavMode = "do" | "build" | "explore";
export type NavGroup = { id: string; zh: string; en: string; modes: NavMode[]; items: NavItem[] };

export const NAV_MODES: { id: NavMode; zh: string; en: string }[] = [
  { id: "do", zh: "今天做", en: "Do today" },
  { id: "build", zh: "构建", en: "Build" },
  { id: "explore", zh: "探索", en: "Explore" },
];

// Always-visible daily entry points.
export const PINNED: NavItem[] = [
  { href: "/today", label: "Today · 今天" },
  { href: "/dashboard", label: "Dashboard", labelKey: "nav.dashboard" },
  { href: "/journey", label: "Journey · Mission Control", labelKey: "nav.journey" },
  { href: "/coach", label: "AI Coach", labelKey: "nav.coach" },
];

// Thematic sections — collapsed by default in the sidebar; the active section auto-opens.
export const NAV_GROUPS: NavGroup[] = [
  { id: "start", zh: "开始", en: "Get started", modes: ["do", "build", "explore"], items: [
    { href: "/start", label: "Start Here", labelKey: "nav.start" },
    { href: "/onboarding", label: "First Run · Full Loop", labelKey: "nav.onboarding" },
    { href: "/project-foundry", label: "Project Foundry · 项目铸造厂" },
    { href: "/skills", label: "All 20 engines · search", labelKey: "nav.skillsAll" },
    { href: "/growth-map", label: "Growth Map", labelKey: "nav.growthMap" },
  ]},
  { id: "diagnose", zh: "诊断与成长", en: "Diagnose & grow", modes: ["do", "explore"], items: [
    { href: "/growth-protocol", label: "Growth Protocol", labelKey: "nav.growthProtocol" },
    { href: "/bottlenecks", label: "Bottleneck Diagnosis", labelKey: "nav.bottlenecks" },
    { href: "/prescriptions", label: "Growth Prescription", labelKey: "nav.prescriptions" },
    { href: "/boardroom", label: "Personal Boardroom", labelKey: "nav.boardroom" },
    { href: "/evidence", label: "Evidence · Gap", labelKey: "nav.evidence" },
    { href: "/experiments", label: "N-of-1 Experiments", labelKey: "nav.experiments" },
  ]},
  { id: "thinking", zh: "思维", en: "Thinking", modes: ["build", "explore"], items: [
    { href: "/synthesis", label: "Cross-Engine Synthesis · 跨引擎综合" },
    { href: "/phronesis", label: "Phronesis · Cognitive", labelKey: "nav.phronesis" },
    { href: "/psychology", label: "Psychology · CBT", labelKey: "nav.psychology" },
    { href: "/decisions", label: "Decisions", labelKey: "nav.decisions" },
    { href: "/models", label: "Genius Library", labelKey: "nav.models" },
    { href: "/role-models", label: "Role Models", labelKey: "nav.roleModels" },
    { href: "/genius-strategies", label: "Genius Strategies", labelKey: "nav.geniusStrategies" },
    { href: "/adaptation", label: "Adaptation", labelKey: "nav.adaptation" },
    { href: "/council", label: "Mentor Council", labelKey: "nav.council" },
    { href: "/future-self", label: "Future Self · Monte Carlo", labelKey: "nav.futureSelf" },
    { href: "/narrative", label: "Growth Narrative", labelKey: "nav.narrative" },
  ]},
  { id: "healing", zh: "疗愈 OS · Healing", en: "Healing OS", modes: ["explore"], items: [
    { href: "/healing-os", label: "Journey Map · 旅程地图" },
    { href: "/healing", label: "Healing Session · 疗愈会谈" },
    { href: "/core-belief", label: "Core Belief · 核心信念" },
    { href: "/cbt", label: "CBT · 认知行为 · 临床" },
    { href: "/emotion-regulation", label: "Emotion Regulation · 情绪调节" },
    { href: "/stabilization", label: "Stabilization · 稳定化" },
    { href: "/parts-work", label: "Parts Work · 内在部分" },
    { href: "/exposure", label: "Exposure · 暴露训练" },
    { href: "/identity-rebuild", label: "Identity Rebuild · 身份重建 · 临床" },
    { href: "/healing-timeline", label: "Healing Timeline · 疗愈时间线 · 临床" },
    { href: "/relapse-prevention", label: "Relapse Prevention · 复发预防" },
    { href: "/safety", label: "Safety & Support · 安全与求助" },
  ]},
  { id: "identity", zh: "身份与方向", en: "Identity & direction", modes: ["build", "explore"], items: [
    { href: "/personal-os", label: "Personal OS Compiler", labelKey: "nav.personalOs" },
    { href: "/identity-tree", label: "Identity Evolution Tree", labelKey: "nav.identityTree" },
    { href: "/telos", label: "Telos · Mission", labelKey: "nav.telos" },
    { href: "/identity", label: "Identity", labelKey: "nav.identity" },
    { href: "/ethos", label: "Ethos · Identity Library", labelKey: "nav.ethos" },
    { href: "/values", label: "Values", labelKey: "nav.values" },
    { href: "/beliefs", label: "Beliefs", labelKey: "nav.beliefs" },
    { href: "/cosmos", label: "Cosmos · Worldview", labelKey: "nav.cosmos" },
    { href: "/cosmos/constellation", label: "Constellation", labelKey: "nav.constellation" },
    { href: "/cosmos/emotions", label: "Emotion Planet", labelKey: "nav.emotions" },
  ]},
  { id: "execution", zh: "执行与精通", en: "Execution & mastery", modes: ["do", "build", "explore"], items: [
    { href: "/deep-work", label: "Deep Work ★", labelKey: "nav.deepWork" },
    { href: "/specific-knowledge", label: "Specific Knowledge ★", labelKey: "nav.specificKnowledge" },
    { href: "/assets", label: "Asset-Based Growth", labelKey: "nav.assets" },
    { href: "/life-capital", label: "Life Capital Ledger", labelKey: "nav.lifeCapital" },
    { href: "/learning-path", label: "Learning Path", labelKey: "nav.learningPath" },
    { href: "/habits", label: "Habits", labelKey: "nav.habits" },
    { href: "/mastery", label: "Mastery", labelKey: "nav.mastery" },
    { href: "/reflection", label: "Reflection", labelKey: "nav.reflection" },
    { href: "/memory-deck", label: "Memory Deck", labelKey: "nav.memoryDeck" },
    { href: "/legacy", label: "Legacy", labelKey: "nav.legacy" },
  ]},
  { id: "naval", zh: "Naval 人生 OS", en: "Naval Life OS", modes: ["build", "explore"], items: [
    { href: "/naval", label: "Naval · Overview", labelKey: "nav.navalOverview" },
    { href: "/naval/dashboard", label: "Naval Dashboard", labelKey: "nav.navalDashboard" },
    { href: "/naval/onboarding", label: "Naval · Get set up", labelKey: "nav.navalOnboarding" },
    { href: "/naval/plan", label: "90-Day Plan", labelKey: "nav.navalPlan" },
    { href: "/naval/specific-knowledge", label: "Specific Knowledge", labelKey: "nav.navalSpecificKnowledge" },
    { href: "/naval/talent-stack", label: "Talent Stack", labelKey: "nav.navalTalentStack" },
    { href: "/naval/leverage", label: "Leverage", labelKey: "nav.navalLeverage" },
    { href: "/naval/judgment", label: "Judgment", labelKey: "nav.navalJudgment" },
    { href: "/naval/decision-journal", label: "Decision Journal", labelKey: "nav.navalDecisionJournal" },
    { href: "/naval/wealth", label: "Wealth Creation", labelKey: "nav.navalWealth" },
    { href: "/naval/assets", label: "Asset Builder", labelKey: "nav.navalAssets" },
    { href: "/naval/opportunities", label: "Opportunities", labelKey: "nav.navalOpportunities" },
    { href: "/naval/long-term-games", label: "Long-Term Games", labelKey: "nav.navalLongTermGames" },
    { href: "/naval/freedom", label: "Freedom", labelKey: "nav.navalFreedom" },
    { href: "/naval/happiness", label: "Happiness", labelKey: "nav.navalHappiness" },
    { href: "/naval/life-portfolio", label: "Life Portfolio", labelKey: "nav.navalLifePortfolio" },
    { href: "/naval/twin", label: "Naval Digital Twin", labelKey: "nav.navalTwin" },
  ]},
  { id: "org", zh: "组织", en: "Organization", modes: ["build", "explore"], items: [
    { href: "/archon", label: "Archon · Leadership", labelKey: "nav.archon" },
    { href: "/oikos", label: "Oikos · Management", labelKey: "nav.oikos" },
    { href: "/praxis", label: "Praxis · Scaling", labelKey: "nav.praxis" },
  ]},
  { id: "childhood", zh: "童年", en: "Childhood", modes: ["explore"], items: [
    { href: "/genius", label: "Genius · Kids", labelKey: "nav.geniusKids" },
  ]},
  { id: "review", zh: "回顾与社区", en: "Review & community", modes: ["do", "explore"], items: [
    { href: "/outcomes", label: "Life Outcomes · 人生成果" },
    { href: "/reviews", label: "Reviews", labelKey: "nav.reviews" },
    { href: "/timeline", label: "Timeline", labelKey: "nav.timeline" },
    { href: "/twin", label: "Digital Twin", labelKey: "nav.digitalTwin" },
    { href: "/graph", label: "Knowledge Graph", labelKey: "nav.graph" },
    { href: "/mnemosyne", label: "Mnemosyne · Listen", labelKey: "nav.mnemosyne" },
    { href: "/community", label: "Agora · Community", labelKey: "nav.community" },
  ]},
  { id: "account", zh: "账户", en: "Account", modes: ["do", "build", "explore"], items: [
    { href: "/account", label: "Account · Trust", labelKey: "nav.accountTrust" },
    { href: "/team", label: "Team seats · 团队席位" },
    { href: "/membership", label: "Membership", labelKey: "nav.membership" },
    { href: "/emporion", label: "Emporion · Store", labelKey: "nav.emporion" },
    { href: "/about", label: "About Arete", labelKey: "nav.about" },
    { href: "/admin", label: "管理后台 Admin", labelKey: "nav.admin" },
  ]},
];

/** Flat, de-duplicated list of every destination (search / command palette). */
export const ALL_NAV: NavItem[] = (() => {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const it of [...PINNED, ...NAV_GROUPS.flatMap((g) => g.items)]) {
    if (!seen.has(it.href)) { seen.add(it.href); out.push(it); }
  }
  return out;
})();
