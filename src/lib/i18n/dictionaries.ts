// i18n dictionaries. Keep keys flat ("section.key") and typed so a missing
// translation is a compile error. zh is the source of truth; en mirrors it.

export type Locale = "zh" | "en";
export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";

const zh = {
  "common.appTagline": "成为你本来所是的样子。",
  "common.logout": "退出登录",
  "common.loading": "加载中…",
  "common.language": "语言",

  "nav.dashboard": "总览",
  "nav.coach": "AI 教练",
  "nav.childhood": "童年",
  "nav.foundation": "根基",
  "nav.direction": "方向",
  "nav.thinking": "思维",
  "nav.execution": "执行",
  "nav.organization": "组织",
  "nav.naval": "Naval 人生 OS",
  "nav.analytics": "分析",
  "nav.library": "内容与社区",
  "nav.account": "账户",

  "login.continue": "登录,继续你的成长",
  "login.create": "创建账户,开始你的成长",
  "login.name": "姓名",
  "login.email": "邮箱",
  "login.password": "密码(至少 8 位)",
  "login.busy": "处理中…",
  "login.login": "登录",
  "login.register": "注册",
  "login.toRegister": "还没有账户?注册",
  "login.toLogin": "已有账户?登录",
  "login.failed": "操作失败,请重试",

  "dashboard.title": "总览",
  "dashboard.subtitle": "使命 → 身份 → 价值观 → 决策 → 习惯 → 品格 → 结果",
  "dashboard.globalScore": "全局成长分",
  "dashboard.globalScoreHint": "/ 100(几何平均 —— 每一层都算数)",
  "dashboard.stage": "人格阶段",
  "dashboard.stageGoal": "目标",
  "dashboard.stageProgress": "进度",
  "dashboard.stageReady": "可以晋升到",
  "dashboard.thisWeek": "本周",
  "dashboard.decisionQuality": "决策质量",
  "dashboard.habitConsistency": "习惯一致性",
  "dashboard.reflection": "反思",
} as const;

export type DictKey = keyof typeof zh;
export type Dict = Record<DictKey, string>;

const en: Dict = {
  "common.appTagline": "Become what you already are.",
  "common.logout": "Log out",
  "common.loading": "Loading…",
  "common.language": "Language",

  "nav.dashboard": "Dashboard",
  "nav.coach": "AI Coach",
  "nav.childhood": "Childhood",
  "nav.foundation": "Foundation",
  "nav.direction": "Direction",
  "nav.thinking": "Thinking",
  "nav.execution": "Execution",
  "nav.organization": "Organization",
  "nav.naval": "Naval Life OS",
  "nav.analytics": "Analytics",
  "nav.library": "Library & Social",
  "nav.account": "Account",

  "login.continue": "Sign in to continue your growth",
  "login.create": "Create an account to begin",
  "login.name": "Name",
  "login.email": "Email",
  "login.password": "Password (8+ characters)",
  "login.busy": "Working…",
  "login.login": "Sign in",
  "login.register": "Sign up",
  "login.toRegister": "No account yet? Sign up",
  "login.toLogin": "Already have an account? Sign in",
  "login.failed": "That didn't work — please try again",

  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Mission → Identity → Values → Decisions → Habits → Character → Outcomes",
  "dashboard.globalScore": "Global Growth Score",
  "dashboard.globalScoreHint": "/ 100 (geometric mean — every layer counts)",
  "dashboard.stage": "Personality Stage",
  "dashboard.stageGoal": "Goal",
  "dashboard.stageProgress": "Progress",
  "dashboard.stageReady": "Ready to advance to",
  "dashboard.thisWeek": "This week",
  "dashboard.decisionQuality": "Decision quality",
  "dashboard.habitConsistency": "Habit consistency",
  "dashboard.reflection": "Reflection",
};

export const DICTIONARIES: Record<Locale, Dict> = { zh, en };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "zh" || value === "en";
}
