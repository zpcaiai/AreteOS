"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

export function AdaptForm({ strategyId }: { strategyId: string }) {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [f, setF] = useState({ currentIdentity: "", goals: "", strengths: "", weaknesses: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  async function submit() {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/excellence/adapt", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ strategyId, ...f }) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      router.push("/adaptation"); router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm font-semibold">{T("把这套蓝图改编给我", "Adapt this blueprint to me")}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <SuggestionField as="input" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={tx("My current identity / role")} value={f.currentIdentity} onChange={(value) => set("currentIdentity", value)} chipLabel={T("身份备选", "Identity options")} suggestions={[T("AI 创业者", "AI founder"), T("产品负责人", "Product lead"), T("研究型创作者", "Research creator")]} />
        <SuggestionField as="input" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={tx("My goal")} value={f.goals} onChange={(value) => set("goals", value)} chipLabel={T("目标备选", "Goal options")} suggestions={[T("90 天内发布可收费 MVP", "Ship a paid MVP in 90 days"), T("建立可复用交付体系", "Build a repeatable delivery system"), T("把专业知识做成资产", "Turn expertise into assets")]} />
        <SuggestionField as="input" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={tx("Strengths")} value={f.strengths} onChange={(value) => set("strengths", value)} chipLabel={T("优势备选", "Strength options")} suggestions={[T("系统思维、快速学习、产品直觉", "Systems thinking, fast learning, product intuition"), T("客户理解、交付经验、行业资源", "Customer understanding, delivery experience, industry network"), T("内容表达、研究能力、长期主义", "Communication, research ability, long-term orientation")]} />
        <SuggestionField as="input" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder={tx("Weaknesses")} value={f.weaknesses} onChange={(value) => set("weaknesses", value)} chipLabel={T("短板备选", "Weakness options")} suggestions={[T("容易范围过大，发布节奏不稳", "Scope gets too large; shipping rhythm is unstable"), T("销售验证不足，过度打磨产品", "Not enough sales validation; over-polishing product"), T("复盘不系统，证据沉淀少", "Reviews are unsystematic; evidence is not captured")]} />
      </div>
      {err && <p className="mt-2 text-sm text-rose-400">{err}</p>}
      <button onClick={submit} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? tx("Adapting…") : tx("Generate adapted blueprint")}</button>
    </div>
  );
}

export function GeneratePathButton({ adaptationId }: { adaptationId: string }) {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function gen() {
    setBusy(true);
    await fetch("/api/excellence/learning-path", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ adaptationId }) });
    setBusy(false); router.push("/learning-path"); router.refresh();
  }
  return <button onClick={gen} disabled={busy} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium disabled:opacity-50">{busy ? "…" : tx("Generate learning path")}</button>;
}

export function StepToggle({ stepId, done }: { stepId: string; done: boolean }) {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    await fetch("/api/excellence/learning-path/step", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ stepId, done: !done }) });
    setBusy(false); router.refresh();
  }
  return (
    <button onClick={toggle} disabled={busy}
      className={`h-5 w-5 shrink-0 rounded border ${done ? "border-emerald-500 bg-emerald-600" : "border-slate-600"}`} aria-label="toggle">
      {done ? "✓" : ""}
    </button>
  );
}
