"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";

const FOUNDER_QUESTIONS = [
  "Why did you start this business?",
  "What customer pain do you understand better than others?",
  "What decisions created the biggest breakthroughs?",
  "What do you refuse to compromise?",
  "What kind of people succeed in your company?",
  "What kind of people fail in your company?",
  "What are your strongest instincts?",
  "When do you override data with judgment?",
  "What repeated behaviors created success?",
  "What risks nearly killed the business?",
  "What do employees misunderstand about your standards?",
  "What should never change as the company scales?",
  "What must change as the company scales?",
  "Which decisions still depend too much on you?",
  "What would break if you disappeared for 90 days?",
];



export default function SfmStudio() {
  const { busy, error, run } = useAgentRun();
  const [answers, setAnswers] = useState<string[]>(Array(FOUNDER_QUESTIONS.length).fill(""));
  const [wins, setWins] = useState("");
  const [founderVals, setFounderVals] = useState("");
  const [decisions, setDecisions] = useState("");
  const [obs, setObs] = useState("");
  const [reflections, setReflections] = useState("");
  const [ctx, setCtx] = useState("");
  const [mission, setMission] = useState("");

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">SFM Studio</h2>
      <p className="mt-1 text-sm text-slate-400">Run each module to model the founder, extract success factors, and generate the replication playbook. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <details className="mt-4 rounded-lg border border-slate-800 p-3" open>
        <summary className="cursor-pointer text-sm font-semibold">1 · Founder DNA Interview</summary>
        <div className="mt-3 space-y-2">
          {FOUNDER_QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="text-xs text-slate-400">{i + 1}. {q}</label>
              <input value={answers[i]} onChange={(e) => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm" />
            </div>
          ))}
          <button disabled={busy !== null}
            onClick={() => run("founder", "/api/praxis/founder/extract", { answers: FOUNDER_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })).filter((a) => a.answer) })}
            className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
            {busy === "founder" ? "Extracting…" : "Extract Founder DNA"}
          </button>
        </div>
      </details>

      <StudioSection title="2 · Success Factors" hint="One win / milestone per line">
        <textarea value={wins} onChange={(e) => setWins(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="factors" onClick={() => run("factors", "/api/praxis/success-factors/analyze", { wins: lines(wins) })} label="Model Success Factors" />
      </StudioSection>

      <StudioSection title="3 · Company Identity" hint="What is the company's mission?">
        <input value={mission} onChange={(e) => setMission(e.target.value)} className={ta} />
        <RunButton busy={busy} runKey="identity" onClick={() => run("identity", "/api/praxis/company-identity/build", { mission })} label="Build Company Identity" />
      </StudioSection>

      <StudioSection title="4 · Values" hint="One founder value per line">
        <textarea value={founderVals} onChange={(e) => setFounderVals(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="values" onClick={() => run("values", "/api/praxis/values/extract", { founderValues: lines(founderVals) })} label="Extract & Rank Values" />
      </StudioSection>

      <StudioSection title="5 · Decision Rules & Operating Principles" hint="One past decision per line">
        <textarea value={decisions} onChange={(e) => setDecisions(e.target.value)} rows={3} className={ta} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="rules" onClick={() => run("rules", "/api/praxis/decision-rules/extract", { decisions: lines(decisions) })} label="Encode Decision Rules" />
          <RunButton busy={busy} runKey="principles" onClick={() => run("principles", "/api/praxis/operating-principles/create", { values: lines(founderVals), decisionRules: lines(decisions) })} label="Build Operating Principles" />
        </div>
      </StudioSection>

      <StudioSection title="6 · Collaboration" hint="One team observation per line">
        <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="collab" onClick={() => run("collab", "/api/praxis/collaboration/analyze", { observations: lines(obs) })} label="Analyze Collaboration" />
      </StudioSection>

      <StudioSection title="7 · Conscious Leadership" hint="One leadership reflection per line">
        <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="lead" onClick={() => run("lead", "/api/praxis/archon/analyze", { reflections: lines(reflections) })} label="Assess Leadership" />
      </StudioSection>

      <StudioSection title="8 · Resilience" hint="One context fact per line (runway, key people, etc.)">
        <textarea value={ctx} onChange={(e) => setCtx(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="res" onClick={() => run("res", "/api/praxis/resilience/stress-test", { context: lines(ctx) })} label="Stress-Test" />
      </StudioSection>

      <StudioSection title="9 · Replication Playbook" hint="Generates the playbook + blueprint from your modeled factors">
        <RunButton busy={busy} runKey="play" onClick={() => run("play", "/api/praxis/playbook/generate", { successFactors: lines(wins), bottlenecks: [] })} label="Generate Replication Playbook" />
      </StudioSection>
    </div>
  );
}

const ta = inputCls;


