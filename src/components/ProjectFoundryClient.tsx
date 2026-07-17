"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Card, PageHeader, ScoreBar, StatGrid } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { SuggestionField } from "@/components/SuggestionField";
import {
  FOUNDRY_CATEGORIES,
  FOUNDRY_FEATURES,
  STARTER_PACKS,
  WORKSPACE_TEMPLATE_CATEGORIES,
  WORKSPACE_TEMPLATES,
  type FoundryCategory,
  type FoundryFeature,
  type ProjectType,
  type StarterPack,
  type WorkspaceTemplateCategory,
  type WorkspaceTemplate,
} from "@/lib/project-foundry-catalog";
import type { ProjectBlueprint, ProjectWorkspace } from "@/lib/project-foundry";
import { useT } from "@/lib/i18n/client";

interface FoundryData {
  features: FoundryFeature[];
  starterPacks: StarterPack[];
  workspaceTemplates: WorkspaceTemplate[];
  blueprints: ProjectBlueprint[];
  workspaces: ProjectWorkspace[];
  teams: { id: string; name: string; role: string; memberCount: number; seats: number }[];
  workspaceTemplateVersion?: number;
}

interface Form {
  id?: string;
  templateId?: string;
  title: string;
  problem: string;
  audience: string;
  projectType: ProjectType;
  selectedIds: string[];
  constraints: string;
  teamId: string | null;
  templateVersion?: number;
}

const emptyForm: Form = { title: "", problem: "", audience: "", projectType: "founder", selectedIds: [], constraints: "", teamId: null };

function effortColor(effort: FoundryFeature["effort"]) {
  return effort === "S" ? "text-emerald-300" : effort === "M" ? "text-amber-300" : "text-rose-300";
}

function templateForm(template: WorkspaceTemplate): Form {
  return {
    templateId: template.id,
    title: template.title,
    problem: template.problem,
    audience: template.audience,
    projectType: template.projectType,
    selectedIds: template.featureIds,
    constraints: template.constraints,
    teamId: null,
  };
}

function workspaceForm(workspace: ProjectWorkspace): Form {
  return {
    id: workspace.id,
    templateId: workspace.templateId,
    title: workspace.title,
    problem: workspace.problem,
    audience: workspace.audience,
    projectType: workspace.projectType,
    selectedIds: workspace.selectedIds,
    constraints: workspace.constraints ?? "",
    teamId: workspace.teamId ?? null,
    templateVersion: workspace.templateVersion,
  };
}

export default function ProjectFoundryClient() {
  const T = useT();
  const catalog = useApi<FoundryData>("/api/project-foundry");
  const [form, setForm] = useState<Form>(emptyForm);
  const [filter, setFilter] = useState<FoundryCategory | "all">("all");
  const [templateFilter, setTemplateFilter] = useState<WorkspaceTemplateCategory | "all">("all");
  const [templateQuery, setTemplateQuery] = useState("");
  const [feedback, setFeedback] = useState({ rating: 0, outcome: "in_progress", comment: "" });
  const [importError, setImportError] = useState("");
  const create = useApiMutation<Omit<Form, "id" | "templateId" | "teamId">, { blueprint: ProjectBlueprint }>("/api/project-foundry", { invalidate: ["/api/project-foundry"] });
  const saveWorkspace = useApiMutation<Form, { workspace: ProjectWorkspace }>("/api/project-foundry/workspaces", { invalidate: ["/api/project-foundry"] });
  const submitFeedback = useApiMutation<{ workspaceId: string; rating: number; outcome: string; comment: string }, { feedback: { id: string } }>("/api/project-foundry/feedback");
  const blueprint = create.data?.blueprint;

  // The library remains usable when saved data is briefly unavailable. Templates
  // are bundled for exactly that reason: the first useful state is never blank.
  const foundry = catalog.data ?? { features: FOUNDRY_FEATURES, starterPacks: STARTER_PACKS, workspaceTemplates: WORKSPACE_TEMPLATES, blueprints: [], workspaces: [], teams: [] };
  const shownFeatures = useMemo(
    () => filter === "all" ? foundry.features : foundry.features.filter((feature) => feature.category === filter),
    [filter, foundry.features],
  );
  const shownTemplates = useMemo(
    () => {
      const query = templateQuery.trim().toLowerCase();
      return foundry.workspaceTemplates.filter((template) => {
        if (templateFilter !== "all" && template.category !== templateFilter) return false;
        if (!query) return true;
        const searchable = [
          template.name.zh, template.name.en, template.description.zh, template.description.en,
          template.title, template.audience, template.problem, template.constraints,
          template.scenario?.zh, template.scenario?.en, template.scale?.zh, template.scale?.en,
          ...(template.keywords ?? []),
        ].filter(Boolean).join(" ").toLowerCase();
        return searchable.includes(query);
      });
    },
    [templateFilter, templateQuery, foundry.workspaceTemplates],
  );
  const selected = new Set(form.selectedIds);
  const isReady = form.title.trim().length >= 2 && form.problem.trim().length >= 10 && form.audience.trim().length >= 2 && form.selectedIds.length > 0;
  const set = (patch: Partial<Form>) => setForm((previous) => ({ ...previous, ...patch }));

  function toggle(id: string) {
    set({ selectedIds: selected.has(id) ? form.selectedIds.filter((item) => item !== id) : [...form.selectedIds, id] });
  }

  function applyTemplate(template: WorkspaceTemplate) {
    setForm(templateForm(template));
  }

  function choosePack(pack: StarterPack) {
    set({ id: undefined, templateId: undefined, projectType: pack.id, selectedIds: pack.featureIds });
  }

  function save() {
    if (!isReady) return;
    saveWorkspace.mutate(form, {
      onSuccess: ({ workspace }) => set({ id: workspace.id, templateVersion: workspace.templateVersion }),
    });
  }

  function exportBlueprint() {
    if (!blueprint) return;
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${blueprint.title.replaceAll(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60) || "project"}-blueprint.json`;
    link.click();
    URL.revokeObjectURL(href);
  }

  function exportWorkspace() {
    if (!isReady) return;
    const payload = { format: "arete-workspace-v1", exportedAt: new Date().toISOString(), workspace: { ...form, id: undefined, teamId: null } };
    const href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = `${form.title.replaceAll(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60) || "workspace"}.arete.json`;
    link.click();
    URL.revokeObjectURL(href);
  }

  async function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 256_000) throw new Error(T("文件不能超过 256KB", "File must be under 256KB"));
      const value = JSON.parse(await file.text()) as { format?: string; workspace?: Partial<Form> };
      const workspace = value.workspace;
      const validTypes = new Set(foundry.starterPacks.map((pack) => pack.id));
      const knownIds = new Set(foundry.features.map((feature) => feature.id));
      if (value.format !== "arete-workspace-v1" || !workspace || typeof workspace.title !== "string" || typeof workspace.problem !== "string" || typeof workspace.audience !== "string" || !validTypes.has(workspace.projectType as ProjectType) || !Array.isArray(workspace.selectedIds)) throw new Error(T("不是有效的 Arete 工作区文件", "Not a valid Arete workspace file"));
      const selectedIds = workspace.selectedIds.filter((id): id is string => typeof id === "string" && knownIds.has(id));
      if (!selectedIds.length) throw new Error(T("文件中没有可用模块", "No supported modules in file"));
      setForm({ id: undefined, templateId: workspace.templateId, title: workspace.title.slice(0, 120), problem: workspace.problem.slice(0, 2000), audience: workspace.audience.slice(0, 500), projectType: workspace.projectType as ProjectType, selectedIds, constraints: typeof workspace.constraints === "string" ? workspace.constraints.slice(0, 1000) : "", teamId: null, templateVersion: workspace.templateVersion });
      setImportError("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : T("导入失败", "Import failed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={T("项目铸造厂 · Project Foundry", "Project Foundry")}
        subtitle={T("直接从可修改的业务工作区开始：场景、用户、问题、边界和能力模块都已填好；你只需按自己的实际情况改动并保存。", "Start with an editable business workspace: scenario, audience, problem, constraints, and modules are already filled in. Adjust what matters and save it.")}
      />

      <Card title={T("选择一个可用工作区", "Choose a ready workspace")} accent="#a78bfa">
        <p className="text-sm leading-6 text-slate-300">{T("这些不是空白表单或仅选模块的推荐包。每个模板都预置了首批用户、真实问题、MVP 边界和对应的 Arete 能力；载入后任何内容都可以修改。", "These are not empty forms or module-only recommendations. Each template includes a first audience, concrete problem, MVP boundary, and matching Arete capabilities; every part remains editable.")}</p>
        <div className="relative mt-4">
          <input value={templateQuery} onChange={(event) => setTemplateQuery(event.target.value)} placeholder={T("搜索行业、场景、企业规模或关键词…", "Search industry, scenario, company size, or keyword…")} aria-label={T("搜索工作区模板", "Search workspace templates")} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 pr-20 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none" />
          {templateQuery && <button type="button" onClick={() => setTemplateQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200">{T("清除", "Clear")}</button>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label={T("模板业务类型", "Template business type")}>
          <button type="button" onClick={() => setTemplateFilter("all")} className={`rounded-full px-3 py-1 text-xs ${templateFilter === "all" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T("全部", "All")} · {foundry.workspaceTemplates.length}</button>
          {(Object.keys(WORKSPACE_TEMPLATE_CATEGORIES) as WorkspaceTemplateCategory[]).map((category) => <button type="button" key={category} onClick={() => setTemplateFilter(category)} className={`rounded-full px-3 py-1 text-xs ${templateFilter === category ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T(WORKSPACE_TEMPLATE_CATEGORIES[category].zh, WORKSPACE_TEMPLATE_CATEGORIES[category].en)} · {foundry.workspaceTemplates.filter((template) => template.category === category).length}</button>)}
        </div>
        <p className="mt-3 text-xs text-slate-500">{T(`当前显示 ${shownTemplates.length} 个场景模板`, `${shownTemplates.length} scenario templates shown`)}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shownTemplates.map((template) => {
            const active = form.templateId === template.id && !form.id;
            return <button key={template.id} type="button" onClick={() => applyTemplate(template)} className={`rounded-xl border p-4 text-left transition ${active ? "border-indigo-400 bg-indigo-950/40" : "border-slate-800 bg-slate-900/50 hover:border-slate-600"}`}>
              <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-slate-100">{T(template.name.zh, template.name.en)}</p><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{T(WORKSPACE_TEMPLATE_CATEGORIES[template.category].zh, WORKSPACE_TEMPLATE_CATEGORIES[template.category].en)}</span></div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{T(template.description.zh, template.description.en)}</p>
              {(template.scenario || template.scale) && <div className="mt-2 flex flex-wrap gap-1.5">
                {template.scenario && <span className="rounded bg-indigo-950/70 px-2 py-0.5 text-[10px] text-indigo-200">{T(template.scenario.zh, template.scenario.en)}</span>}
                {template.scale && <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">{T(template.scale.zh, template.scale.en)}</span>}
              </div>}
              <p className="mt-3 text-[11px] text-indigo-300">{template.featureIds.length} {T("个预置模块 · 点击载入", "preloaded modules · click to load")}</p>
            </button>;
          })}
          {shownTemplates.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">{T("没有匹配的模板。可清除关键词或切换业务分类。", "No templates match. Clear the query or switch business category.")}</div>}
        </div>
      </Card>

      {foundry.workspaces.length > 0 && <section className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-slate-200">{T("我的已保存工作区", "My saved workspaces")}</h2><span className="text-xs text-slate-500">{T("打开后继续修改，再次保存会保留历史。", "Open, edit, and save again; prior revisions remain in history.")}</span></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {foundry.workspaces.map((workspace) => <button key={workspace.id} type="button" onClick={() => setForm(workspaceForm(workspace))} className={`rounded-xl border p-4 text-left transition ${form.id === workspace.id ? "border-emerald-400 bg-emerald-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-600"}`}>
            <p className="text-sm font-medium text-slate-100">{workspace.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{workspace.problem}</p>
            <div className="mt-3 flex items-center justify-between gap-2 text-[11px]"><span className="text-emerald-300">{workspace.selectedIds.length} {T("个模块 · 点击继续编辑", "modules · continue editing")}</span><span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">{workspace.teamName ? `${T("团队", "Team")}: ${workspace.teamName}` : T("个人", "Personal")}</span></div>
          </button>)}
        </div>
      </section>}

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card title={T("正在编辑的工作区", "Workspace details")}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">{form.id ? T("已打开已保存工作区", "Saved workspace open") : form.templateId ? T("模板已载入，尚未保存为我的工作区", "Template loaded; not yet saved to My Workspaces") : T("可从上方模板开始，或自行配置", "Choose a template above, or configure it yourself")}{form.templateId ? ` · Template v${form.templateVersion ?? foundry.workspaceTemplateVersion ?? 1}` : ""}</span>
            <span className="flex gap-3">{form.id && <button type="button" onClick={() => setForm({ ...form, id: undefined })} className="text-indigo-300 hover:text-indigo-200">{T("另存为新的工作区", "Save as a new workspace")}</button>}<button type="button" onClick={exportWorkspace} disabled={!isReady} className="text-sky-300 disabled:opacity-40">{T("导出工作区", "Export workspace")}</button><label className="cursor-pointer text-sky-300">{T("导入工作区", "Import workspace")}<input type="file" accept="application/json,.json" onChange={importWorkspace} className="sr-only" /></label></span>
          </div>
          {importError && <p role="alert" className="mb-3 text-xs text-rose-400">{importError}</p>}
          <div className="grid gap-3 md:grid-cols-2">
            <SuggestionField
              as="input"
              label={T("工作区名称", "Workspace name")}
              value={form.title}
              onChange={(value) => set({ title: value })}
              placeholder={T("例如：研究者的论文行动教练", "e.g. Paper-action coach for researchers")}
              chipLabel={T("命名备选", "Name options")}
              suggestions={[
                T("客户验证工作台", "Customer validation workspace"),
                T("MVP 发布准备室", "MVP launch room"),
                T("AI 业务增长实验台", "AI business growth lab"),
              ]}
            />
            <SuggestionField
              as="input"
              label={T("首批用户", "First users")}
              value={form.audience}
              onChange={(value) => set({ audience: value })}
              placeholder={T("例如：正在写论文的硕博生", "e.g. Graduate students writing papers")}
              chipLabel={T("用户备选", "Audience options")}
              suggestions={[
                T("正在验证新业务方向的创始人", "Founders validating a new business direction"),
                T("需要把服务产品化的小微企业主", "Small-business owners productizing a service"),
                T("承担创新项目的一线业务负责人", "Business leads owning an innovation project"),
              ]}
            />
          </div>
          <div className="mt-3">
            <SuggestionField
              label={T("他们在什么情境下遇到什么问题？", "What problem do they face, in what situation?")}
              value={form.problem}
              onChange={(value) => set({ problem: value })}
              rows={3}
              placeholder={T("写下具体摩擦、现有替代方案和期待结果。", "Describe the friction, current workaround, and desired outcome.")}
              chipLabel={T("问题备选", "Problem options")}
              suggestions={[
                T("用户愿意表达需求，但没有完成一次真实付费或交付验证。", "Users express interest, but no real payment or delivery validation has happened."),
                T("团队有很多功能想法，却缺少一个可在两周内交付的 MVP 边界。", "The team has many feature ideas but lacks a two-week MVP boundary."),
                T("业务流程依赖人工经验，无法沉淀证据、复盘和可复制交付。", "The workflow depends on tacit manual experience and lacks evidence, review, and repeatable delivery."),
              ]}
            />
          </div>
          <div className="mt-3">
            <label className="block text-xs text-slate-400">{T("工作区共享范围", "Workspace access")}</label>
            <select value={form.teamId ?? ""} onChange={(event) => set({ teamId: event.target.value || null })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
              <option value="">{T("仅自己可见", "Private to me")}</option>
              {foundry.teams.map((team) => <option key={team.id} value={team.id}>{T("团队共享", "Shared with team")} · {team.name} ({team.memberCount}/{team.seats})</option>)}
            </select>
            <p className="mt-1 text-xs text-slate-500">{T("团队成员可打开并继续修改；每次保存都会增加修订版本并写入审计事件。", "Team members can open and edit it; every save increments the revision and writes an audit event.")}</p>
          </div>
          <div className="mt-3">
            <SuggestionField
              as="input"
              label={T("边界与约束", "Constraints")}
              value={form.constraints}
              onChange={(value) => set({ constraints: value })}
              placeholder={T("例如：两人团队、6 周、不能处理敏感医疗数据", "e.g. 2-person team, 6 weeks, no sensitive medical data")}
              chipLabel={T("约束备选", "Constraint options")}
              suggestions={[
                T("两人团队，6 周内上线，不处理敏感数据。", "Two-person team, ship in 6 weeks, no sensitive data."),
                T("只能使用现有客户渠道，先验证付费意愿。", "Use existing customer channels only; validate willingness to pay first."),
                T("必须保留人工复核，AI 只能做建议与草稿。", "Human review must remain; AI only suggests and drafts."),
              ]}
            />
          </div>
        </Card>

        <Card title={T("保存并生成", "Save & forge")} accent="#38bdf8">
          <StatGrid items={[{ value: form.selectedIds.length, label: T("已选模块", "selected modules") }, { value: foundry.features.filter((feature) => selected.has(feature.id) && feature.effort === "L").length, label: T("大型模块", "large modules") }]} />
          <p className="mt-4 text-sm leading-6 text-slate-400">{T("先保存自己的工作区，日后可以继续修改。生成蓝图会创建一份可导出、可交付的版本快照。", "Save your workspace first so it can be changed later. Forging creates an exportable hand-off snapshot.")}</p>
          <button type="button" onClick={save} disabled={saveWorkspace.isPending || !isReady} className="mt-4 w-full rounded-lg border border-emerald-500/70 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-950/50 disabled:cursor-not-allowed disabled:opacity-50">
            {saveWorkspace.isPending ? T("正在保存工作区…", "Saving workspace…") : form.id ? T("保存修改", "Save changes") : T("保存到我的工作区", "Save to My Workspaces")}
          </button>
          <button type="button" onClick={() => create.mutate({ title: form.title, problem: form.problem, audience: form.audience, projectType: form.projectType, selectedIds: form.selectedIds, constraints: form.constraints })} disabled={create.isPending || !isReady} className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
            {create.isPending ? T("正在铸造蓝图…", "Forging blueprint…") : T("生成可交付蓝图", "Forge hand-off blueprint")}
          </button>
          <div className="mt-2 min-h-5" aria-live="polite">
            {saveWorkspace.isSuccess && <p className="text-sm text-emerald-400">{T("工作区已保存，可随时打开继续修改。", "Workspace saved. You can reopen and edit it anytime.")}</p>}
            {(saveWorkspace.error || create.error) && <p role="alert" className="text-sm text-rose-400">{saveWorkspace.error?.message ?? create.error?.message}</p>}
          </div>
        </Card>
      </div>

      {form.id && form.templateId && <div className="mt-5"><Card title={T("模板试用反馈", "Template pilot feedback")} accent="#f59e0b">
        <p className="text-sm text-slate-400">{T("请按真实使用结果评价当前模板；反馈会绑定模板版本，用于下一轮改进。", "Rate the current template from real use; feedback is tied to its version for the next iteration.")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating} onClick={() => setFeedback((current) => ({ ...current, rating }))} className={`h-9 w-9 rounded-lg border text-sm ${feedback.rating === rating ? "border-amber-400 bg-amber-950 text-amber-200" : "border-slate-700 text-slate-400"}`}>{rating}</button>)}<select value={feedback.outcome} onChange={(event) => setFeedback((current) => ({ ...current, outcome: event.target.value }))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"><option value="not_started">{T("尚未开始", "Not started")}</option><option value="in_progress">{T("试用中", "In progress")}</option><option value="useful">{T("已产生效果", "Useful")}</option><option value="not_useful">{T("未解决问题", "Not useful")}</option></select></div>
        <textarea value={feedback.comment} onChange={(event) => setFeedback((current) => ({ ...current, comment: event.target.value }))} maxLength={1000} rows={3} placeholder={T("哪些预设有效？还缺什么？", "What worked, and what is missing?")} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200" />
        <button type="button" disabled={!feedback.rating || submitFeedback.isPending} onClick={() => submitFeedback.mutate({ workspaceId: form.id!, ...feedback })} className="mt-3 rounded-lg border border-amber-500/70 px-4 py-2 text-sm text-amber-200 disabled:opacity-40">{submitFeedback.isPending ? T("提交中…", "Submitting…") : T("提交反馈", "Submit feedback")}</button>
        {submitFeedback.isSuccess && <span className="ml-3 text-sm text-emerald-400">{T("反馈已保存", "Feedback saved")}</span>}{submitFeedback.error && <p role="alert" className="mt-2 text-sm text-rose-400">{submitFeedback.error.message}</p>}
      </Card></div>}

      {catalog.isError && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-700/50 bg-amber-950/20 p-3 text-sm text-amber-100" role="status">
        <span>{T("模板与能力目录仍可使用；已保存工作区暂时无法读取或保存。", "Templates and capabilities remain usable; saved workspaces are temporarily unavailable.")}</span>
        <button type="button" onClick={() => catalog.refetch()} className="rounded-lg border border-amber-500/60 px-3 py-1.5 text-xs font-medium hover:bg-amber-900/40">{T("重试", "Retry")}</button>
      </div>}

      <section className="mt-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="mr-2 text-sm font-semibold text-slate-200">{T("能力模块（可按需增减）", "Capability modules (adjust as needed)")}</h2>
          <select value={form.projectType} onChange={(event) => set({ projectType: event.target.value as ProjectType })} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300" aria-label={T("方案类型", "Solution type")}>
            {foundry.starterPacks.map((pack) => <option key={pack.id} value={pack.id}>{T(pack.name.zh, pack.name.en)}</option>)}
          </select>
          <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 text-xs ${filter === "all" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T("全部", "All")}</button>
          {(Object.keys(FOUNDRY_CATEGORIES) as FoundryCategory[]).map((category) => <button type="button" key={category} onClick={() => setFilter(category)} className={`rounded-full px-3 py-1 text-xs ${filter === category ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T(FOUNDRY_CATEGORIES[category].zh, FOUNDRY_CATEGORIES[category].en)}</button>)}
          <button type="button" onClick={() => choosePack(foundry.starterPacks.find((pack) => pack.id === form.projectType)!)} className="ml-auto rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500">{T("按方案重置模块", "Reset modules to pack")}</button>
        </div>
        {catalog.isLoading ? <p className="text-sm text-slate-500">{T("正在读取工具箱…", "Loading toolbox…")}</p> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shownFeatures.map((feature) => <label key={feature.id} className={`cursor-pointer rounded-xl border p-4 transition ${selected.has(feature.id) ? "border-indigo-400 bg-indigo-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-600"}`}>
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selected.has(feature.id)} onChange={() => toggle(feature.id)} className="mt-1 h-4 w-4 accent-indigo-500" />
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-slate-100">{T(feature.name.zh, feature.name.en)}</span><span className={`text-xs font-semibold ${effortColor(feature.effort)}`}>{feature.effort}</span></div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{T(feature.summary.zh, feature.summary.en)}</p>
                <p className="mt-2 truncate text-[11px] text-slate-500">{feature.source}{feature.sensitive ? ` · ${T("需安全设计", "safety design")}` : ""}</p>
              </div>
            </div>
          </label>)}
        </div>}
      </section>

      {foundry.blueprints.length > 0 && <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">{T("已保存的蓝图快照", "Saved blueprint snapshots")}</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {foundry.blueprints.map((saved) => <button key={saved.id} type="button" onClick={() => setForm({ title: saved.title, problem: saved.problem, audience: saved.audience, projectType: saved.projectType, selectedIds: saved.selectedFeatures.map((feature) => feature.id), constraints: saved.constraints, teamId: null })} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left hover:border-slate-600">
            <p className="text-sm font-medium text-slate-100">{saved.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{saved.problem}</p>
            <p className="mt-3 text-[11px] text-indigo-300">{saved.selectedFeatures.length} {T("个模块 · 复制到编辑区", "modules · copy to workspace")}</p>
          </button>)}
        </div>
      </section>}

      {blueprint && <section className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-white">{T("项目蓝图", "Project blueprint")} · {blueprint.title}</h2><button type="button" onClick={exportBlueprint} className="rounded-lg border border-indigo-400 px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-950/50">{T("导出 JSON 蓝图", "Export JSON blueprint")}</button></div>
        <Card title={T("可行性与 MVP 边界", "Feasibility & MVP boundary")} accent="#34d399">
          <ScoreBar label={T(`可落地度 · ${blueprint.feasibility.label}`, `Feasibility · ${blueprint.feasibility.label}`)} value={blueprint.feasibility.score / 100} />
          <p className="mt-3 text-sm text-slate-200">{blueprint.mvp.outcome}</p>
          {blueprint.feasibility.reasons.length > 0 && <ul className="mt-3 space-y-1 text-sm text-amber-200">{blueprint.feasibility.reasons.map((reason, index) => <li key={index}>· {reason}</li>)}</ul>}
          {blueprint.addedPrerequisites.length > 0 && <p className="mt-3 text-xs text-slate-400">{T("已自动加入前置条件：", "Prerequisites added automatically: ")}{blueprint.addedPrerequisites.map((feature) => T(feature.name.zh, feature.name.en)).join(" · ")}</p>}
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title={T("交付阶段", "Delivery phases")}><ol className="space-y-4">{blueprint.phases.map((phase) => <li key={phase.name}><p className="text-sm font-medium text-slate-200">{phase.name}</p><p className="text-xs text-slate-400">{phase.goal}</p><p className="mt-1 text-xs text-indigo-200">{phase.featureIds.map((id) => foundry.features.find((feature) => feature.id === id)?.name ? T(foundry.features.find((feature) => feature.id === id)!.name.zh, foundry.features.find((feature) => feature.id === id)!.name.en) : id).join(" · ")}</p></li>)}</ol></Card>
          <Card title={T("风险与发布检查", "Risks & release checks")}><ul className="space-y-2 text-sm text-slate-300">{blueprint.risks.map((risk, index) => <li key={index}>· {risk}</li>)}</ul><ul className="mt-4 space-y-2 border-t border-slate-800 pt-4 text-sm text-slate-400">{blueprint.deliveryChecklist.map((item, index) => <li key={index}>□ {item}</li>)}</ul></Card>
        </div>
      </section>}
    </div>
  );
}
