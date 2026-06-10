"use client";
import { useEffect, useState } from "react";

interface Goal { id: string; statement: string; horizon: string; why: string; targetDate: string | null }
const HORIZONS = ["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"] as const;
const label = (h: string) => ({ ONE_YEAR: "1 year", THREE_YEARS: "3 years", FIVE_YEARS: "5 years", TEN_YEARS: "10 years", LIFETIME: "Lifetime" } as Record<string, string>)[h] ?? h;

export default function GoalCard() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [editing, setEditing] = useState(false);
  const [statement, setStatement] = useState("");
  const [horizon, setHorizon] = useState<string>("FIVE_YEARS");
  const [why, setWhy] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/naval/goals");
    if (r.ok) { const d = await r.json(); setGoal(d.goal); if (!d.goal) setEditing(true); }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!statement.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/naval/goals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ statement, horizon, why }) });
      if (r.ok) { setGoal((await r.json()).goal); setEditing(false); setStatement(""); setWhy(""); }
    } finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">North-star goal</h2>
        {goal && !editing && <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-slate-200">Edit</button>}
      </div>
      {!editing && goal ? (
        <div>
          <p className="text-base text-slate-100">{goal.statement}</p>
          <p className="mt-1 text-xs text-slate-500">Horizon: {label(goal.horizon)}{goal.why ? ` · ${goal.why}` : ""}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea value={statement} onChange={(e) => setStatement(e.target.value)} rows={2} placeholder="e.g. Own assets that buy back all my time within 5 years."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm">
              {HORIZONS.map((h) => <option key={h} value={h}>{label(h)}</option>)}
            </select>
            <input value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why it matters (optional)" className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm" />
          </div>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">{busy ? "Saving…" : "Save goal"}</button>
        </div>
      )}
    </div>
  );
}
