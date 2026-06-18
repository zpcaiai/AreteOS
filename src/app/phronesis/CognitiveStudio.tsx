"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";

const ta = inputCls;


export default function CognitiveStudio() {
  const tx = useTx();
  const T = useT();
  const { busy, error, note, run } = useAgentRun();
  const out = note;
  const [goal, setGoal] = useState("");
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [reflections, setReflections] = useState("");
  const [journal, setJournal] = useState("");
  const [situation, setSituation] = useState("");
  const [problem, setProblem] = useState("");
  const [lessons, setLessons] = useState("");


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("认知工作室", "Cognitive Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">Build a latticework, run decisions through lenses, detect biases, journal & review, reason under uncertainty, diagnose problems, and distill wisdom. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <StudioSection title="1 · Build a Latticework" hint="A goal — get a diverse model network + blind spots">
        <input value={goal} onChange={(e) => setGoal(e.target.value)} className={ta} placeholder={tx("e.g. Build an AI startup")} />
        <RunButton busy={busy} runKey="lat" onClick={() => run("lat", "/api/phronesis/latticework", { goal })} label="Build Latticework" />
      </StudioSection>

      <StudioSection title="2 · Decision Lens" hint="A decision — analyzed through 8 lenses with a confidence score">
        <input value={decision} onChange={(e) => setDecision(e.target.value)} className={ta} placeholder={tx("e.g. Should I start a company?")} />
        <RunButton busy={busy} runKey="lens" onClick={() => run("lens", "/api/phronesis/lens", { decision }, (j) => `Confidence: ${Math.round(((j.result as { confidence: number })?.confidence ?? 0) * 100)}`)} label="Run Lenses" />
      </StudioSection>

      <StudioSection title="3 · Bias Detector" hint="Paste a piece of reasoning — get likely biases + corrections">
        <textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="bias" onClick={() => run("bias", "/api/phronesis/bias/analyze", { reasoning }, (j) => `Bias risk: ${Math.round(((j.riskScore as number) ?? 0) * 100)}`)} label="Detect Biases" />
      </StudioSection>

      <StudioSection title="4 · Judgment & Meta-Thinking" hint="Reflections on how you decide — one per line">
        <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={3} className={ta} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="judg" onClick={() => run("judg", "/api/phronesis/judgment", { reflections: lines(reflections) })} label="Score Judgment" />
          <RunButton busy={busy} runKey="meta" onClick={() => run("meta", "/api/phronesis/meta", { reflections: lines(reflections) })} label="Cognitive Profile" />
        </div>
      </StudioSection>

      <StudioSection title="5 · Decision Journal" hint="A decision to journal (assumptions + expected outcome get structured)">
        <input value={journal} onChange={(e) => setJournal(e.target.value)} className={ta} placeholder={tx("e.g. Hire a senior engineer now")} />
        <RunButton busy={busy} runKey="jrnl" onClick={() => run("jrnl", "/api/phronesis/decision-journal", { decision: journal })} label="Journal Decision" />
      </StudioSection>

      <StudioSection title="6 · Uncertainty" hint="A situation under uncertainty — get options + tail risks">
        <input value={situation} onChange={(e) => setSituation(e.target.value)} className={ta} placeholder={tx("e.g. Launching into a new market")} />
        <RunButton busy={busy} runKey="unc" onClick={() => run("unc", "/api/phronesis/uncertainty", { situation })} label="Assess Uncertainty" />
      </StudioSection>

      <StudioSection title="7 · Strategic Diagnosis" hint="A problem — get root causes + leverage points">
        <input value={problem} onChange={(e) => setProblem(e.target.value)} className={ta} placeholder={tx("e.g. Growth has stalled")} />
        <RunButton busy={busy} runKey="diag" onClick={() => run("diag", "/api/phronesis/diagnosis", { problem })} label="Diagnose" />
      </StudioSection>

      <StudioSection title="8 · Wisdom" hint="Lessons learned — one per line — distilled into insights + principles">
        <textarea value={lessons} onChange={(e) => setLessons(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="wis" onClick={() => run("wis", "/api/phronesis/wisdom", { lessons: lines(lessons) })} label="Distill Wisdom" />
      </StudioSection>
    </div>
  );
}

