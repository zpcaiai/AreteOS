"use client";

// The Batch-1 minimal loop in one place:
//   problem → Safety Triage → (gate) → Mental State Intake → Dilts Map + 5P →
//   recommended intervention path. Red risk shows crisis support only; orange
//   shows stabilization first but still allows a shallow formulation.

import { useState } from "react";
import { Card, PageHeader, Empty } from "@/components/ui";
import { useApiMutation } from "@/lib/hooks";
import { useT, useI18n } from "@/lib/i18n/client";
import SafetyBanner from "./SafetyBanner";
import CrisisSupportCard from "./CrisisSupportCard";
import GroundingExerciseCard from "./GroundingExerciseCard";
import DiltsMapCanvas from "./DiltsMapCanvas";
import CaseFormulationCard from "./CaseFormulationCard";
import InterventionPathCard from "./InterventionPathCard";
import NextSkillLinks from "./NextSkillLinks";
import type { SafetyTriageOutput, RiskLevel } from "@/lib/domain/risk";
import type { MentalStateIntakeOutput } from "@/lib/domain/mental-state";
import type { DiltsClinicalFormulationOutput } from "@/lib/domain/dilts";

type IntakeResult = MentalStateIntakeOutput & { intakeId: string };
type FormulationResult = DiltsClinicalFormulationOutput & { formulationId: string; depth: string };

const RATINGS: { key: string; zh: string; en: string }[] = [
  { key: "anxiety", zh: "焦虑", en: "Anxiety" },
  { key: "mood", zh: "情绪低落", en: "Low mood" },
  { key: "shame", zh: "羞耻", en: "Shame" },
  { key: "sleepQuality", zh: "睡眠质量", en: "Sleep quality" },
];

export default function HealingSession() {
  const T = useT();
  const { locale } = useI18n();
  const [sessionId] = useState(() => (globalThis.crypto?.randomUUID?.() ?? `s_${Date.now()}`));
  const [problem, setProblem] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const safety = useApiMutation<{ sessionId: string; message: string; context: { locale: string } }, { result: SafetyTriageOutput }>("/api/safety");
  const intake = useApiMutation<{ sessionId: string; freeText: string; ratings: Record<string, number> }, { result: IntakeResult }>("/api/intake");
  const dilts = useApiMutation<Record<string, unknown>, { result: FormulationResult }>("/api/dilts-map");

  const safetyResult = safety.data?.result;
  const intakeResult = intake.data?.result;
  const diltsResult = dilts.data?.result;
  const level: RiskLevel | undefined = safetyResult?.riskLevel;
  const blocked = level === "red";
  const canContinue = !!safetyResult && !blocked;

  async function runSafety() {
    setRatings(ratings);
    intake.reset();
    dilts.reset();
    await safety.mutateAsync({ sessionId, message: problem, context: { locale: locale === "en" ? "en-US" : "zh-CN" } }).catch(() => {});
  }
  async function runIntake() {
    await intake.mutateAsync({ sessionId, freeText: problem, ratings }).catch(() => {});
  }
  async function runDilts() {
    await dilts
      .mutateAsync({
        sessionId,
        problemStatement: problem,
        intakeId: intakeResult?.intakeId,
        primaryConcerns: intakeResult?.primaryConcerns?.map((c) => c.concern) ?? [],
        dominantEmotions: intakeResult?.emotionalProfile?.dominantEmotions ?? [],
        maintainingLoops: intakeResult?.likelyMaintainingLoops?.map((l) => l.loopName) ?? [],
        userPreferences: { language: locale === "en" ? "en" : "zh" },
      })
      .catch(() => {});
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={T("疗愈会谈 · Healing Session", "Healing Session")}
        subtitle={T("说出此刻的困扰，我们先确保安全，再一层层梳理。", "Tell me what's weighing on you. We make sure you're safe first, then map it level by level.")}
      />

      <Card title={T("此刻发生了什么？", "What's going on right now?")}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
          placeholder={T("例如：我一开会就紧张，怕说错话，所以总是沉默，会后又很后悔。", "e.g. I freeze up in meetings, afraid I'll say something wrong, so I stay silent and regret it afterward.")}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-100"
        />
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {RATINGS.map((r) => (
            <label key={r.key} className="text-xs text-slate-400">
              {T(r.zh, r.en)} · <span className="tabular-nums text-slate-300">{ratings[r.key] ?? 0}</span>
              <input
                type="range" min={0} max={10} value={ratings[r.key] ?? 0}
                onChange={(e) => setRatings((s) => ({ ...s, [r.key]: Number(e.target.value) }))}
                className="mt-1 w-full accent-indigo-500"
              />
            </label>
          ))}
        </div>
        <button
          onClick={runSafety}
          disabled={!problem.trim() || safety.isPending}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          {safety.isPending ? T("正在确认安全…", "Checking in…") : T("开始", "Begin")}
        </button>
        {safety.error && <p className="mt-2 text-sm text-rose-400" role="alert">{safety.error.message}</p>}
      </Card>

      {safetyResult && <SafetyBanner level={safetyResult.riskLevel} message={safetyResult.userFacingMessage} />}

      {safetyResult && (level === "orange" || level === "red") && (
        <div className="grid gap-4 md:grid-cols-2">
          <CrisisSupportCard plan={safetyResult.safetyPlan} />
          <GroundingExerciseCard grounding={safetyResult.safetyPlan?.groundingExercise} />
        </div>
      )}

      {blocked && (
        <Empty>{T("当前以安全为先。我们暂停深入分析，等你更稳一些，随时可以回来继续。", "Safety comes first right now. We're pausing the deeper work — come back whenever you feel steadier.")}</Empty>
      )}

      {canContinue && !intakeResult && (
        <button onClick={runIntake} disabled={intake.isPending}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50">
          {intake.isPending ? T("梳理中…", "Mapping your state…") : T("继续：当前状态评估", "Continue: assess current state")}
        </button>
      )}

      {intakeResult && (
        <Card title={T("当前心理画像", "Current snapshot")}>
          <p className="text-sm leading-relaxed text-slate-200">{intakeResult.summary}</p>
          {intakeResult.likelyMaintainingLoops?.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400">{T("可能的维持循环", "Likely maintaining loops")}</div>
              <ul className="mt-1 space-y-2 text-sm text-slate-300">
                {intakeResult.likelyMaintainingLoops.map((l, i) => (
                  <li key={i} className="rounded-lg bg-slate-950/40 px-3 py-2">
                    <div className="text-slate-100">{l.loopName}</div>
                    <div className="text-xs text-slate-400">{l.description}</div>
                    <div className="mt-1 text-xs"><span className="text-emerald-400/80">{T("短期", "Short-term")}:</span> {l.shortTermReward} · <span className="text-rose-400/80">{T("长期", "Long-term")}:</span> {l.longTermCost}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!diltsResult && (
            <button onClick={runDilts} disabled={dilts.isPending}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
              {dilts.isPending ? T("生成中…", "Building map…") : T("生成 Dilts 人格地图 + 5P", "Build Dilts map + 5P")}
            </button>
          )}
        </Card>
      )}

      {diltsResult && (
        <div className="space-y-4">
          <Card title={T("个案概念化摘要", "Formulation summary")}>
            <p className="text-sm leading-relaxed text-slate-200">{diltsResult.formulationSummary}</p>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <div><div className="mb-2 text-xs font-semibold text-slate-400">{T("Dilts 六层人格地图", "Dilts six-level map")}</div><DiltsMapCanvas map={diltsResult.diltsMap} /></div>
            <div className="space-y-4">
              <CaseFormulationCard fiveP={diltsResult.fiveP} />
              <InterventionPathCard path={diltsResult.recommendedInterventionPath} />
            </div>
          </div>
          {diltsResult.cautions?.length > 0 && (
            <p className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
              {diltsResult.cautions.join(" ")}
            </p>
          )}
          <NextSkillLinks
            skills={diltsResult.recommendedInterventionPath.map((s) => s.skill)}
            title={T("推荐的下一步（点击进入）", "Recommended next steps (tap to open)")}
          />
        </div>
      )}
    </div>
  );
}
