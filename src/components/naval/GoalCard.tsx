"use client";
import { useEffect, useState } from "react";
import { useApi, useApiMutation } from "@/lib/hooks";
import { NavalGoalSchema, firstIssue } from "@/lib/schemas";
import { useI18n } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

interface Goal { id: string; statement: string; horizon: string; why: string; targetDate: string | null }
const HORIZONS = ["ONE_YEAR", "THREE_YEARS", "FIVE_YEARS", "TEN_YEARS", "LIFETIME"] as const;


export default function GoalCard() {
  const { t } = useI18n();
  const label = (h: string) =>
    ({ ONE_YEAR: t("ui.goal.h1"), THREE_YEARS: t("ui.goal.h3"), FIVE_YEARS: t("ui.goal.h5"), TEN_YEARS: t("ui.goal.h10"), LIFETIME: t("ui.goal.hLife") } as Record<string, string>)[h] ?? h;
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
        <h2 className="text-sm font-semibold">{t("ui.goal.title")}</h2>
        {goal && !editing && <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-slate-200">{t("ui.goal.edit")}</button>}
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">{t("ui.goal.loading")}</p>
      ) : !editing && goal ? (
        <div>
          <p className="text-base text-slate-100">{goal.statement}</p>
          <p className="mt-1 text-xs text-slate-500">{t("ui.goal.horizon")}: {label(goal.horizon)}{goal.why ? ` · ${goal.why}` : ""}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <SuggestionField
            value={statement}
            onChange={(value) => { setStatement(value); validate({ statement: value, horizon, why }); }}
            rows={2}
            placeholder={t("ui.goal.placeholder")}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            chipLabel="目标备选"
            suggestions={[
              "5 年内拥有一个稳定复利的自有资产组合",
              "用专属知识建立一个可收费产品",
              "把当前工作转化为长期自由度",
            ]}
          />
          <div className="flex gap-2">
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)} aria-label="Goal horizon" className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm">
              {HORIZONS.map((h) => <option key={h} value={h}>{label(h)}</option>)}
            </select>
            <div className="flex-1">
              <SuggestionField
                as="input"
                value={why}
                onChange={(value) => { setWhy(value); validate({ statement, horizon, why: value }); }}
                placeholder={t("ui.goal.why")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm"
                chipLabel="原因备选"
                suggestions={[
                  "因为我想把时间从低杠杆事务中解放出来。",
                  "因为它会迫使我积累可复利资产，而不是只卖时间。",
                  "因为这能提升家庭和事业的长期选择权。",
                ]}
              />
            </div>
          </div>
          {issue && <p className="text-xs text-amber-400" role="alert">{issue}</p>}
          {save.error && <p className="text-xs text-rose-400" role="alert">{save.error.message}</p>}
          <button onClick={submit} disabled={save.isPending || !!issue} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {save.isPending ? t("ui.goal.saving") : t("ui.goal.save")}
          </button>
        </div>
      )}
    </div>
  );
}
