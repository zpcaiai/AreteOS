"use client";

// Reusable shell for every standalone intervention page (Batch 2-4). It ALWAYS
// runs safety triage on the input first and only proceeds if not red — so no
// skill page can bypass the gate. Renders the safety banner + crisis cards when
// needed, then hands the skill result to `renderResult`.

import { useState, type ReactNode } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useT, useI18n } from "@/lib/i18n/client";
import SafetyBanner from "./SafetyBanner";
import CrisisSupportCard from "./CrisisSupportCard";
import GroundingExerciseCard from "./GroundingExerciseCard";
import type { SafetyTriageOutput } from "@/lib/domain/risk";

export default function HealingSkillShell<TResult>({
  title,
  subtitle,
  endpoint,
  placeholder,
  buildBody,
  renderResult,
  cta,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  placeholder: string;
  buildBody: (problem: string, sessionId: string, ratings: Record<string, number>) => Record<string, unknown>;
  renderResult: (result: TResult) => ReactNode;
  cta?: { zh: string; en: string };
}) {
  const T = useT();
  const { locale } = useI18n();
  const [sessionId] = useState(() => globalThis.crypto?.randomUUID?.() ?? `s_${Date.now()}`);
  const [problem, setProblem] = useState("");
  const safety = useApiMutation<{ sessionId: string; message: string; context: { locale: string } }, { result: SafetyTriageOutput }>("/api/safety");
  const skill = useApiMutation<Record<string, unknown>, { result: TResult }>(endpoint);

  const safetyResult = safety.data?.result;
  const level = safetyResult?.riskLevel;
  const blocked = level === "red";

  async function run() {
    skill.reset();
    const s = await safety.mutateAsync({ sessionId, message: problem, context: { locale: locale === "en" ? "en-US" : "zh-CN" } }).catch(() => null);
    if (!s || s.result.riskLevel === "red") return;
    await skill.mutateAsync(buildBody(problem, sessionId, {})).catch(() => {});
  }

  const pending = safety.isPending || skill.isPending;

  return (
    <div className="space-y-5">
      <PageHeader title={title} subtitle={subtitle} />

      <Card title={T("此刻发生了什么？", "What's going on right now?")}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-100"
        />
        <button onClick={run} disabled={!problem.trim() || pending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          {pending ? T("处理中…", "Working…") : T(cta?.zh ?? "开始", cta?.en ?? "Begin")}
        </button>
        {(safety.error || skill.error) && <p className="mt-2 text-sm text-rose-400" role="alert">{(safety.error ?? skill.error)?.message}</p>}
      </Card>

      {safetyResult && <SafetyBanner level={safetyResult.riskLevel} message={safetyResult.userFacingMessage} />}
      {safetyResult && (level === "orange" || level === "red") && (
        <div className="grid gap-4 md:grid-cols-2">
          <CrisisSupportCard plan={safetyResult.safetyPlan} />
          <GroundingExerciseCard grounding={safetyResult.safetyPlan?.groundingExercise} />
        </div>
      )}
      {blocked && (
        <p className="rounded-xl border border-dashed border-slate-700/70 bg-slate-900/30 px-6 py-6 text-center text-sm text-slate-400">
          {T("当前以安全为先，暂停这项练习。等你更稳一些随时回来。", "Safety first — this exercise is paused. Come back whenever you feel steadier.")}
        </p>
      )}

      {skill.data?.result && renderResult(skill.data.result)}
    </div>
  );
}
