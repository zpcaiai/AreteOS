"use client";
import { useEffect, useState } from "react";
import { useApi, useApiMutation } from "@/lib/hooks";
import { NavalGoalSchema, firstIssue } from "@/lib/schemas";

interface Goal { id: string; statement: string; horizon: string; why: string; targetDate: string | null }
const HORIZONS = ["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"] as const;
const label = (h: string) => ({ ONE_YEAR: "1 year", THREE_YEARS: "3 years", FIVE_YEARS: "5 years", TEN_YEARS: "10 years", LIFETIME: "Lifetime" } as Record<string, string>)[h] ?? h;

export default function GoalCard() {
  const { data, isLoading } = useApi<{ goal: Goal | null }>("/api/naval/goals");
  const save = useApiMutation<{ statement: string; horizon: string; why: string }, { goal: Goal }>(
    "/api/naval/goals",
    { invalidate: ["/api/naval/goals"] },
  );

  const [editing, setEditing] = useState(false);
  const [statement, setStatement] = useState("");
  const [horizon, setHorizon] = useState<string>("FIVE_YEARS");
  const [why, setWhy] = useState("");
  const [issue, setIssue] = useState<string | null>(null);

  const goal = data?.goal ?? null;
  useEffect(() => { if (!isLoading && !goal) setEditing(true); }, [isLoading, goal]);

  function validate(next: { statement: string; horizon: string; why: string }) {
    setIssue(firstIssue(NavalGoalSchema, next));
  }

  async function submit() {
    const body = { statement, horizon, why };
    const problem = firstIssue(NavalGoalSchema, body);
    setIssue(problem);
    if (problem) return;
    try {
      await save.mutateAsync(body);
      setEditing(false);
      setStatement("");
      setWhy("");
    } catch {
      /* error shown below via save.error */
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">North-star goal</h2>
        {goal && !editing && <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-slate-200">Edit</button>}
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !editing && goal ? (
        <div>
          <p className="text-base text-slate-100">{goal.statement}</p>
          <p className="mt-1 text-xs text-slate-500">Horizon: {label(goal.horizon)}{goal.why ? ` · ${goal.why}` : ""}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={statement}
            onChange={(e) => { setStatement(e.target.value); validate({ statement: e.target.value, horizon, why }); }}
            rows={2}
            placeholder="e.g. Own assets that buy back all my time within 5 years."
            aria-label="Goal statement"
            aria-invalid={issue ? true : undefined}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)} aria-label="Goal horizon" className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm">
              {HORIZONS.map((h) => <option key={h} value={h}>{label(h)}</option>)}
            </select>
            <input
              value={why}
              onChange={(e) => { setWhy(e.target.value); validate({ statement, horizon, why: e.target.value }); }}
              placeholder="Why it matters (optional)"
              aria-label="Why this goal matters"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm"
            />
          </div>
          {issue && <p className="text-xs text-amber-400" role="alert">{issue}</p>}
          {save.error && <p className="text-xs text-rose-400" role="alert">{save.error.message}</p>}
          <button onClick={submit} disabled={save.isPending || !!issue} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {save.isPending ? "Saving…" : "Save goal"}
          </button>
        </div>
      )}
    </div>
  );
}
