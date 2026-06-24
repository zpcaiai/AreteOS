"use client";

import { useMemo, useState } from "react";
import { Card, PageHeader, ScoreBar, StatGrid } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
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
}

const emptyForm: Form = { title: "", problem: "", audience: "", projectType: "founder", selectedIds: [], constraints: "" };

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
  };
}

export default function ProjectFoundryClient() {
  const T = useT();
  const catalog = useApi<FoundryData>("/api/project-foundry");
  const [form, setForm] = useState<Form>(emptyForm);
  const [filter, setFilter] = useState<FoundryCategory | "all">("all");
  const [templateFilter, setTemplateFilter] = useState<WorkspaceTemplateCategory | "all">("all");
  const create = useApiMutation<Omit<Form, "id" | "templateId">, { blueprint: ProjectBlueprint }>("/api/project-foundry", { invalidate: ["/api/project-foundry"] });
  const saveWorkspace = useApiMutation<Form, { workspace: ProjectWorkspace }>("/api/project-foundry/workspaces", { invalidate: ["/api/project-foundry"] });
  const blueprint = create.data?.blueprint;

  // The library remains usable when saved data is briefly unavailable. Templates
  // are bundled for exactly that reason: the first useful state is never blank.
  const foundry = catalog.data ?? { features: FOUNDRY_FEATURES, starterPacks: STARTER_PACKS, workspaceTemplates: WORKSPACE_TEMPLATES, blueprints: [], workspaces: [] };
  const shownFeatures = useMemo(
    () => filter === "all" ? foundry.features : foundry.features.filter((feature) => feature.category === filter),
    [filter, foundry.features],
  );
  const shownTemplates = useMemo(
    () => templateFilter === "all" ? foundry.workspaceTemplates : foundry.workspaceTemplates.filter((template) => template.category === templateFilter),
    [templateFilter, foundry.workspaceTemplates],
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
      onSuccess: ({ workspace }) => set({ id: workspace.id }),
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

  return (
    <div>
      <PageHeader
        title={T("项目铸造厂 · Project Foundry", "Project Foundry")}
        subtitle={T("直接从可修改的业务工作区开始：场景、用户、问题、边界和能力模块都已填好；你只需按自己的实际情况改动并保存。", "Start with an editable business workspace: scenario, audience, problem, constraints, and modules are already filled in. Adjust what matters and save it.")}
      />

      <Card title={T("选择一个可用工作区", "Choose a ready workspace")} accent="#a78bfa">
        <p className="text-sm leading-6 text-slate-300">{T("这些不是空白表单或仅选模块的推荐包。每个模板都预置了首批用户、真实问题、MVP 边界和对应的 Arete 能力；载入后任何内容都可以修改。", "These are not empty forms or module-only recommendations. Each template includes a first audience, concrete problem, MVP boundary, and matching Arete capabilities; every part remains editable.")}</p>
        <div className="mt-4 flex flex-wrap gap-2" aria-label={T("模板业务类型", "Template business type")}>
          <button type="button" onClick={() => setTemplateFilter("all")} className={`rounded-full px-3 py-1 text-xs ${templateFilter === "all" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T("全部", "All")} · {foundry.workspaceTemplates.length}</button>
          {(Object.keys(WORKSPACE_TEMPLATE_CATEGORIES) as WorkspaceTemplateCategory[]).map((category) => <button type="button" key={category} onClick={() => setTemplateFilter(category)} className={`rounded-full px-3 py-1 text-xs ${templateFilter === category ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>{T(WORKSPACE_TEMPLATE_CATEGORIES[category].zh, WORKSPACE_TEMPLATE_CATEGORIES[category].en)}</button>)}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shownTemplates.map((template) => {
            const active = form.templateId === template.id && !form.id;
            return <button key={template.id} type="button" onClick={() => applyTemplate(template)} className={`rounded-xl border p-4 text-left transition ${active ? "border-indigo-400 bg-indigo-950/40" : "border-slate-800 bg-slate-900/50 hover:border-slate-600"}`}>
              <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-slate-100">{T(template.name.zh, template.name.en)}</p><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{T(WORKSPACE_TEMPLATE_CATEGORIES[template.category].zh, WORKSPACE_TEMPLATE_CATEGORIES[template.category].en)}</span></div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{T(template.description.zh, template.description.en)}</p>
              <p className="mt-3 text-[11px] text-indigo-300">{template.featureIds.length} {T("个预置模块 · 点击载入", "preloaded modules · click to load")}</p>
            </button>;
          })}
        </div>
      </Card>

      {foundry.workspaces.length > 0 && <section className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-slate-200">{T("我的已保存工作区", "My saved workspaces")}</h2><span className="text-xs text-slate-500">{T("打开后继续修改，再次保存会保留历史。", "Open, edit, and save again; prior revisions remain in history.")}</span></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {foundry.workspaces.map((workspace) => <button key={workspace.id} type="button" onClick={() => setForm(workspaceForm(workspace))} className={`rounded-xl border p-4 text-left transition ${form.id === workspace.id ? "border-emerald-400 bg-emerald-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-600"}`}>
            <p className="text-sm font-medium text-slate-100">{workspace.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{workspace.problem}</p>
            <p className="mt-3 text-[11px] text-emerald-300">{workspace.selectedIds.length} {T("个模块 · 点击继续编辑", "modules · continue editing")}</p>
          </button>)}
        </div>
      </section>}

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card title={T("正在编辑的工作区", "Workspace details")}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">{form.id ? T("已打开已保存工作区", "Saved workspace open") : form.templateId ? T("模板已载入，尚未保存为我的工作区", "Template loaded; not yet saved to My Workspaces") : T("可从上方模板开始，或自行配置", "Choose a template above, or configure it yourself")}</span>
            {form.id && <button type="button" onClick={() => setForm({ ...form, id: undefined })} className="text-indigo-300 hover:text-indigo-200">{T("另存为新的工作区", "Save as a new workspace")}</button>}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">{T("工作区名称", "Workspace name")}
              <input value={form.title} onChange={(event) => set({ title: event.target.value })} placeholder={T("例如：研究者的论文行动教练", "e.g. Paper-action coach for researchers")} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm" />
            </label>
            <label className="text-sm text-slate-300">{T("首批用户", "First users")}
              <input value={form.audience} onChange={(event) => set({ audience: event.target.value })} placeholder={T("例如：正在写论文的硕博生", "e.g. Graduate students writing papers")} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm" />
            </label>
          </div>
          <label className="mt-3 block text-sm text-slate-300">{T("他们在什么情境下遇到什么问题？", "What problem do they face, in what situation?")}
            <textarea value={form.problem} onChange={(event) => set({ problem: event.target.value })} rows={3} placeholder={T("写下具体摩擦、现有替代方案和期待结果。", "Describe the friction, current workaround, and desired outcome.")} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm" />
          </label>
          <label className="mt-3 block text-sm text-slate-300">{T("边界与约束", "Constraints")}
            <input value={form.constraints} onChange={(event) => set({ constraints: event.target.value })} placeholder={T("例如：两人团队、6 周、不能处理敏感医疗数据", "e.g. 2-person team, 6 weeks, no sensitive medical data")} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm" />
          </label>
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
          {foundry.blueprints.map((saved) => <button key={saved.id} type="button" onClick={() => setForm({ title: saved.title, problem: saved.problem, audience: saved.audience, projectType: saved.projectType, selectedIds: saved.selectedFeatures.map((feature) => feature.id), constraints: saved.constraints })} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left hover:border-slate-600">
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
