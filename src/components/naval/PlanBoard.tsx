"use client";
import { useEffect, useState } from "react";

interface Task { id: string; month: number; engine: string; task: string; done: boolean }
interface MonthMeta { month: number; theme: string; focus: string }
interface Plan { id: string; headline: string; northStar: string; progress: number; status: string; tasks: Task[]; metadata?: { months?: MonthMeta[] } }

export default function PlanBoard() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const r = await fetch("/api/naval/plan/active");
    if (r.ok) setPlan((await r.json()).plan);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function generate() {
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/naval/plan/save", { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setPlan(d.plan);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  async function toggle(t: Task) {
    if (!plan) return;
    const next = !t.done;
    setPlan({ ...plan, tasks: plan.tasks.map((x) => (x.id === t.id ? { ...x, done: next } : x)) });
    const r = await fetch("/api/naval/plan/task", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ taskId: t.id, done: next }) });
    if (r.ok) { const d = await r.json(); setPlan((p) => (p ? { ...p, progress: d.progress, status: d.completed ? "COMPLETED" : "ACTIVE" } : p)); }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading plan…</p>;

  if (!plan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm text-slate-400">No active 90-day plan yet. Generate one from your current Naval state.</p>
        {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}
        <button onClick={generate} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {busy ? "Generating…" : "Generate my 90-day plan"}
        </button>
      </div>
    );
  }

  const months = plan.metadata?.months ?? [1, 2, 3].map((m) => ({ month: m, theme: "", focus: "" }));
  const pct = Math.round((plan.progress ?? 0) * 100);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold">90-Day Plan {plan.status === "COMPLETED" && <span className="text-emerald-400">· complete 🎉</span>}</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-slate-400">{pct}%</span>
            <button onClick={generate} disabled={busy} className="rounded-md bg-slate-800 px-2.5 py-1 text-xs hover:bg-slate-700 disabled:opacity-50">{busy ? "…" : "Regenerate"}</button>
          </div>
        </div>
        <div className="mb-3 h-2 w-full rounded-full bg-slate-800"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
        <p className="text-sm text-slate-400">{plan.headline}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {months.map((m) => (
          <div key={m.month} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Month {m.month}{m.theme ? ` · ${m.theme}` : ""}</div>
            {m.focus && <div className="mb-2 text-xs text-slate-500">{m.focus}</div>}
            <ul className="mt-2 space-y-2">
              {plan.tasks.filter((t) => t.month === m.month).map((t) => (
                <li key={t.id} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={t.done} onChange={() => toggle(t)} className="mt-1 h-4 w-4 accent-indigo-500" />
                  <span className={t.done ? "text-slate-500 line-through" : "text-slate-300"}>{t.task}<span className="block text-[11px] text-slate-600">{t.engine}</span></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="rounded-lg bg-slate-800/60 px-4 py-3 text-sm italic text-slate-300">North star — {plan.northStar}</p>
    </div>
  );
}
