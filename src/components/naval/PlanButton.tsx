"use client";
import { useState } from "react";

interface PlanTask { task: string; engine: string }
interface PlanMonth { month: number; theme: string; focus: string; tasks: PlanTask[] }
interface Plan { headline: string; northStar: string; months: PlanMonth[] }

export default function PlanButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);

  async function run() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/naval/plan/90-day", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPlan(data.plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button onClick={run} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
        {busy ? "Generating…" : plan ? "Regenerate 90-day plan" : "Generate my 90-day plan"}
      </button>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      {plan && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-300">{plan.headline}</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {plan.months.map((m) => (
              <div key={m.month} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Month {m.month} · {m.theme}</div>
                <div className="mb-2 text-xs text-slate-500">{m.focus}</div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {m.tasks.map((t, i) => (
                    <li key={i} className="border-t border-slate-800 pt-2">{t.task}<div className="text-[11px] text-slate-500">{t.engine}</div></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="rounded-lg bg-slate-800/60 px-4 py-3 text-sm italic text-slate-300">North star — {plan.northStar}</p>
        </div>
      )}
    </div>
  );
}
