"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdaptForm({ strategyId }: { strategyId: string }) {
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
      <div className="mb-2 text-sm font-semibold">Adapt this blueprint to me</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="My current identity / role" value={f.currentIdentity} onChange={(e) => set("currentIdentity", e.target.value)} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="My goal" value={f.goals} onChange={(e) => set("goals", e.target.value)} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="Strengths" value={f.strengths} onChange={(e) => set("strengths", e.target.value)} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" placeholder="Weaknesses" value={f.weaknesses} onChange={(e) => set("weaknesses", e.target.value)} />
      </div>
      {err && <p className="mt-2 text-sm text-rose-400">{err}</p>}
      <button onClick={submit} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? "Adapting…" : "Generate adapted blueprint"}</button>
    </div>
  );
}

export function GeneratePathButton({ adaptationId }: { adaptationId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function gen() {
    setBusy(true);
    await fetch("/api/excellence/learning-path", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ adaptationId }) });
    setBusy(false); router.push("/learning-path"); router.refresh();
  }
  return <button onClick={gen} disabled={busy} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium disabled:opacity-50">{busy ? "…" : "Generate learning path"}</button>;
}

export function StepToggle({ stepId, done }: { stepId: string; done: boolean }) {
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
