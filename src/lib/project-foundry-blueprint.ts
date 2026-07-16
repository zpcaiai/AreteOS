// Pure Project-Foundry blueprint logic — catalog-only, no DB/events. Split out so it
// can be unit-tested in isolation (see project-foundry.ts for the DB service that
// re-exports this surface).

import {
  FEATURE_BY_ID,
  STARTER_PACKS,
  type FoundryFeature,
  type ProjectType,
} from "./project-foundry-catalog";

export interface ProjectBriefInput {
  title: string;
  problem: string;
  audience: string;
  projectType: ProjectType;
  selectedIds: string[];
  constraints?: string;
}

export interface ProjectBlueprint {
  id: string;
  title: string;
  projectType: ProjectType;
  problem: string;
  audience: string;
  constraints: string;
  selectedFeatures: FoundryFeature[];
  addedPrerequisites: FoundryFeature[];
  feasibility: { score: number; label: "ready" | "needs_focus" | "discovery_needed"; reasons: string[] };
  mvp: { outcome: string; featureIds: string[]; exclusions: string[] };
  phases: { name: string; goal: string; featureIds: string[] }[];
  risks: string[];
  deliveryChecklist: string[];
  createdAt: number;
}

/** A mutable workbench saved by the user before (or after) forging a blueprint. */
export interface ProjectWorkspace extends ProjectBriefInput {
  id: string;
  templateId?: string;
  teamId?: string;
  ownerId?: string;
  teamName?: string;
  revision?: number;
  updatedAt: number;
}

const PLATFORM_IDS = new Set(["auth-roles", "privacy-controls", "audit-history", "analytics-observability", "quality-release", "api-integration", "offline-localization"]);
const SAFE_MVP_LIMIT = 8;

export function uniqueKnown(ids: string[]) {
  return [...new Set(ids)].filter((id) => FEATURE_BY_ID[id]);
}

/** Add prerequisite capabilities recursively so a chosen feature has a viable base. */
export function expandFeatureDependencies(ids: string[]) {
  const selected = new Set(uniqueKnown(ids));
  const added = new Set<string>();
  const visit = (id: string) => {
    const feature = FEATURE_BY_ID[id];
    for (const dependency of feature?.dependencies ?? []) {
      if (!selected.has(dependency)) { selected.add(dependency); added.add(dependency); visit(dependency); }
    }
  };
  [...selected].forEach(visit);
  return { selectedIds: [...selected], addedIds: [...added] };
}

function feasibility(input: ProjectBriefInput, features: FoundryFeature[]) {
  const reasons: string[] = [];
  const scope = features.length;
  let score = 35;
  if (input.problem.trim().length >= 40) score += 20; else reasons.push("把问题写得更具体：谁在什么情境下遇到什么阻碍？");
  if (input.audience.trim().length >= 12) score += 15; else reasons.push("把首批用户收窄到一个可接触的人群。");
  if (scope >= 3 && scope <= SAFE_MVP_LIMIT) score += 20;
  else if (scope < 3) { score += 5; reasons.push("至少选择一个核心体验和一个验证/交付能力。 "); }
  else reasons.push(`当前选择 ${scope} 个模块；首个 MVP 建议压到 ${SAFE_MVP_LIMIT} 个以内。`);
  if (features.some((feature) => feature.id === "validation-experiments" || feature.id === "reflection-review")) score += 10;
  else reasons.push("加入验证实验或复盘，避免在没有反馈前扩大建设。 ");
  score = Math.min(100, score);
  return {
    score,
    label: (score >= 80 ? "ready" : score >= 60 ? "needs_focus" : "discovery_needed") as "ready" | "needs_focus" | "discovery_needed",
    reasons,
  };
}

function projectRisks(features: FoundryFeature[]) {
  const ids = new Set(features.map((feature) => feature.id));
  const risks: string[] = [];
  if (features.length > SAFE_MVP_LIMIT) risks.push("范围过宽：将第一版限制为一个核心用户、一个关键结果、一个主路径。");
  if (ids.has("ai-coach") && !ids.has("knowledge-base")) risks.push("AI 体验缺少可靠上下文：先定义允许读取的数据和不可回答的边界。");
  if (ids.has("community") && !ids.has("moderation-safety")) risks.push("社区需要举报、审核和升级机制；该前提已被自动加入。");
  if (features.some((feature) => feature.sensitive)) risks.push("涉及健康、儿童或高风险对话：保持非诊断表述，并明确人工支持与紧急求助路径。");
  if (!ids.has("analytics-observability")) risks.push("尚未选择度量与可观测性：至少记录激活、完成和留存三个信号。");
  return risks;
}

function phaseFeatures(features: FoundryFeature[], predicate: (feature: FoundryFeature) => boolean) {
  return features.filter(predicate).map((feature) => feature.id);
}

export function buildProjectBlueprint(input: ProjectBriefInput): ProjectBlueprint {
  const pack = STARTER_PACKS.find((candidate) => candidate.id === input.projectType);
  const explicit = uniqueKnown(input.selectedIds);
  const requested = explicit.length ? explicit : (pack?.featureIds ?? []);
  const { selectedIds, addedIds } = expandFeatureDependencies(requested);
  const selectedFeatures = selectedIds.map((id) => FEATURE_BY_ID[id]);
  const addedPrerequisites = addedIds.map((id) => FEATURE_BY_ID[id]);
  const productFeatures = selectedFeatures.filter((feature) => !PLATFORM_IDS.has(feature.id));
  const mvpFeatures = productFeatures.slice(0, SAFE_MVP_LIMIT);
  const riskFeatures = phaseFeatures(selectedFeatures, (feature) => feature.category === "safety");
  const foundation = phaseFeatures(selectedFeatures, (feature) => feature.category === "discovery" || PLATFORM_IDS.has(feature.id));
  const build = mvpFeatures.map((feature) => feature.id);
  const measure = phaseFeatures(selectedFeatures, (feature) => ["growth", "organization", "intelligence"].includes(feature.category) && !mvpFeatures.some((mvp) => mvp.id === feature.id));
  const score = feasibility(input, selectedFeatures);

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `foundry_${Date.now()}`,
    title: input.title.trim(),
    projectType: input.projectType,
    problem: input.problem.trim(),
    audience: input.audience.trim(),
    constraints: input.constraints?.trim() ?? "",
    selectedFeatures,
    addedPrerequisites,
    feasibility: score,
    mvp: {
      outcome: `让 ${input.audience.trim()} 能够更快、更可靠地解决：${input.problem.trim()}`,
      featureIds: build,
      exclusions: productFeatures.slice(SAFE_MVP_LIMIT).map((feature) => feature.id),
    },
    phases: [
      { name: "01 · 验证", goal: "确认问题、首批用户与成功信号", featureIds: foundation },
      { name: "02 · MVP", goal: "交付一条能产生核心结果的端到端路径", featureIds: build },
      { name: "03 · 信任", goal: "补齐安全、隐私、角色与可追溯性", featureIds: riskFeatures },
      { name: "04 · 试点与迭代", goal: "用真实使用、反馈和指标决定下一步", featureIds: measure },
    ].filter((phase) => phase.featureIds.length > 0),
    risks: projectRisks(selectedFeatures),
    deliveryChecklist: [
      "写下一个可衡量的核心结果和首批用户名单。",
      "为 MVP 画出单一主路径，并明确刻意不做的内容。",
      "建立真实数据、权限、删除/导出和错误处理的验收条件。",
      "为每个阶段设定继续、调整或停止的决策门槛。",
      "在发布前完成类型检查、关键流程测试和真实用户试用。",
    ],
    createdAt: Date.now(),
  };
}
