"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useTx } from "@/lib/i18n/client";

const ta = inputCls;


export default function ManagementStudio() {
  const tx = useTx();
  const { busy, error, run } = useAgentRun();
  const [reflections, setReflections] = useState("");
  const [activities, setActivities] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [signals, setSignals] = useState("");
  const [healthSignals, setHealthSignals] = useState("");
  const [alignInputs, setAlignInputs] = useState("");
  const [decisions, setDecisions] = useState("");
  const [designCtx, setDesignCtx] = useState("");
  const [scenario, setScenario] = useState("");
  const [frag, setFrag] = useState({ founderDependency: 0.5, keyPersonDependency: 0.5, customerConcentration: 0.5, knowledgeConcentration: 0.5, productConcentration: 0.5 });

  // "activity: hours" per line
  const parseActivities = (s: string) => lines(s).map((l) => {
    const m = l.match(/^(.*?):\s*(\d+(\.\d+)?)\s*$/);
    return m ? { activity: m[1].trim(), hoursPerWeek: parseFloat(m[2]) } : { activity: l, hoursPerWeek: 1 };
  });


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">Management Studio</h2>
      <p className="mt-1 text-sm text-slate-400">Assess maturity, redistribute leverage, capture knowledge, govern decisions, and stress-test resilience. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <StudioSection title="1 · Management Assessment" hint="Reflections on how you spend your week — one per line">
        <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="assess" onClick={() => run("assess", "/api/oikos/assessment", { reflections: lines(reflections) })} label="Assess Maturity" />
      </StudioSection>

      <StudioSection title="2 · Leverage Analysis" hint="One activity per line, format: 'Activity: hours' (e.g. 'Status meetings: 10')">
        <textarea value={activities} onChange={(e) => setActivities(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="lev" onClick={() => run("lev", "/api/oikos/leverage", { activities: parseActivities(activities) })} label="Analyze Leverage" />
      </StudioSection>

      <StudioSection title="3 · Knowledge Capture (SECI)" hint="Topic + expert notes (one per line)">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} className={ta} placeholder={tx("Topic (e.g. incident triage)")} />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={ta} placeholder={tx("Tacit notes…")} />
        <RunButton busy={busy} runKey="cap" onClick={() => run("cap", "/api/oikos/knowledge/capture", { topic, notes: lines(notes) })} label="Capture → Playbook + Prompts" />
      </StudioSection>

      <StudioSection title="4 · Knowledge-Worker Effectiveness" hint="Signals about how work actually flows — one per line">
        <textarea value={signals} onChange={(e) => setSignals(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="kw" onClick={() => run("kw", "/api/oikos/knowledge/worker", { signals: lines(signals) })} label="Assess Effectiveness" />
      </StudioSection>

      <StudioSection title="5 · Alignment" hint="Observations on how the org actually behaves — one per line">
        <textarea value={alignInputs} onChange={(e) => setAlignInputs(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="align" onClick={() => run("align", "/api/oikos/alignment", { inputs: lines(alignInputs) })} label="Measure Alignment" />
      </StudioSection>

      <StudioSection title="6 · Organizational Health" hint="Culture signals — one per line">
        <textarea value={healthSignals} onChange={(e) => setHealthSignals(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="hl" onClick={() => run("hl", "/api/oikos/health", { signals: lines(healthSignals) })} label="Measure Health" />
      </StudioSection>

      <StudioSection title="7 · Decision Governance" hint="Recent decisions / patterns — one per line">
        <textarea value={decisions} onChange={(e) => setDecisions(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="dec" onClick={() => run("dec", "/api/oikos/decisions", { decisions: lines(decisions) })} label="Govern Decisions" />
      </StudioSection>

      <StudioSection title="8 · Anti-Fragile Stress Test" hint="Set concentration/dependency risks (0–1), add context lines">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(frag) as (keyof typeof frag)[]).map((k) => (
            <label key={k} className="text-xs text-slate-400">{k}
              <input type="number" min={0} max={1} step={0.1} value={frag[k]} onChange={(e) => setFrag({ ...frag, [k]: parseFloat(e.target.value) })} className={ta} />
            </label>
          ))}
        </div>
        <input value={scenario} onChange={(e) => setScenario(e.target.value)} className={ta} placeholder={tx("Scenario (e.g. key engineer leaves)")} />
        <RunButton busy={busy} runKey="stress" onClick={() => run("stress", "/api/oikos/stress-test", { ...frag, scenario, context: [] })} label="Run Stress Test" />
      </StudioSection>

      <StudioSection title="9 · Organization Design" hint="Context about the current org — one per line">
        <textarea value={designCtx} onChange={(e) => setDesignCtx(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="des" onClick={() => run("des", "/api/oikos/design", { context: lines(designCtx) })} label="Design Organization" />
      </StudioSection>

      <StudioSection title="10 · Management Digital Twin" hint="Simulate a change against your modeled org">
        <input value={scenario} onChange={(e) => setScenario(e.target.value)} className={ta} placeholder={tx("Scenario to simulate")} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="twin" onClick={() => run("twin", "/api/oikos/twin/simulate", { scenario })} label="Simulate Twin" />
          <RunButton busy={busy} runKey="coach" onClick={() => run("coach", "/api/oikos/coaching", { context: lines(reflections) })} label="Coaching Plan" />
        </div>
      </StudioSection>
    </div>
  );
}

