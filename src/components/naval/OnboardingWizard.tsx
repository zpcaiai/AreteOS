"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Step { step: number; title: string; href: string }
interface State { currentStep: number; completedSteps: number[]; status: string; steps: Step[]; total: number }

export default function OnboardingWizard() {
  const [s, setS] = useState<State | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  async function load() {
    const r = await fetch("/api/naval/onboarding");
    if (r.ok) setS(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function mark(step: number) {
    setBusy(step);
    try {
      const r = await fetch("/api/naval/onboarding", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ step }) });
      if (r.ok) setS(await r.json());
    } finally { setBusy(null); }
  }

  if (!s) return <p className="text-sm text-slate-500">Loading onboarding…</p>;
  const pct = Math.round((s.completedSteps.length / s.total) * 100);
  const done = (n: number) => s.completedSteps.includes(n);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Setup · {s.completedSteps.length}/{s.total} steps</h2>
        <span className="text-xs text-slate-400">{s.status === "COMPLETED" ? "Complete 🎉" : `${pct}%`}</span>
      </div>
      <div className="mb-4 h-2 w-full rounded-full bg-slate-800"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
      <ol className="space-y-2">
        {s.steps.map((st) => {
          const isDone = done(st.step);
          const isCurrent = st.step === s.currentStep && !isDone;
          return (
            <li key={st.step} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${isCurrent ? "border-indigo-600 bg-indigo-600/10" : "border-slate-800"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${isDone ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}>{isDone ? "✓" : st.step}</span>
              <Link href={st.href} className={`flex-1 text-sm ${isDone ? "text-slate-500 line-through" : "text-slate-200 hover:text-indigo-300"}`}>{st.title}</Link>
              {!isDone && (
                <button onClick={() => mark(st.step)} disabled={busy === st.step} className="rounded-md bg-slate-800 px-2.5 py-1 text-xs hover:bg-slate-700 disabled:opacity-50">
                  {busy === st.step ? "…" : "Mark done"}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
