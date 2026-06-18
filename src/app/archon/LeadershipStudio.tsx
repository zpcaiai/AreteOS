"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { ROLES } from "@/lib/archon/levels";
import { useT, useTx } from "@/lib/i18n/client";

const ta = inputCls;


export default function LeadershipStudio() {
  const tx = useTx();
  const T = useT();
  const { busy, error, run } = useAgentRun();
  const [inputs, setInputs] = useState("");
  const [mission, setMission] = useState("");
  const [signals, setSignals] = useState("");
  const [alignInputs, setAlignInputs] = useState("");
  const [candidate, setCandidate] = useState("");
  const [evidence, setEvidence] = useState("");
  const [role, setRole] = useState("SPONSOR");
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [values, setValues] = useState("");


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("领导力工作室", "Leadership Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">Map your leverage, build a vision, sponsor identity, and develop future leaders. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <StudioSection title="1 · Leverage Map" hint="Paste meeting notes / 1:1s / journal lines — one per line">
        <textarea value={inputs} onChange={(e) => setInputs(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="lev" onClick={() => run("lev", "/api/archon/leverage-map", { inputs: lines(inputs) })} label="Map Leverage" />
      </StudioSection>

      <StudioSection title="2 · Vision" hint="Your mission (the vision is generated and aligned)">
        <input value={mission} onChange={(e) => setMission(e.target.value)} className={ta} />
        <RunButton busy={busy} runKey="vis" onClick={() => run("vis", "/api/archon/vision", { mission })} label="Create / Align Vision" />
      </StudioSection>

      <StudioSection title="3 · Belonging" hint="One team signal per line">
        <textarea value={signals} onChange={(e) => setSignals(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="bel" onClick={() => run("bel", "/api/archon/belonging", { signals: lines(signals) })} label="Assess Belonging" />
      </StudioSection>

      <StudioSection title="4 · Organizational Alignment" hint="One observation about how the org actually behaves, per line">
        <textarea value={alignInputs} onChange={(e) => setAlignInputs(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="align" onClick={() => run("align", "/api/archon/alignment", { inputs: lines(alignInputs) })} label="Measure Alignment" />
      </StudioSection>

      <StudioSection title="5 · Identity Sponsorship & Conversations" hint="Pick a role and describe the situation">
        <select value={role} onChange={(e) => setRole(e.target.value)} className={ta}>
          {ROLES.map((r) => <option key={r.role} value={r.role}>{r.role} — {r.mindset}</option>)}
        </select>
        <textarea value={situation} onChange={(e) => setSituation(e.target.value)} rows={2} className={ta} placeholder={tx("Situation…")} />
        <RunButton busy={busy} runKey="conv" onClick={() => run("conv", "/api/archon/conversation", { role, situation })} label="Generate Conversation Script" />
      </StudioSection>

      <StudioSection title="6 · Future Leaders" hint="Candidate + evidence (one per line)">
        <input value={candidate} onChange={(e) => setCandidate(e.target.value)} className={ta} placeholder={tx("Candidate name")} />
        <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} rows={2} className={ta} placeholder={tx("Evidence…")} />
        <RunButton busy={busy} runKey="fut" onClick={() => run("fut", "/api/archon/future-leader", { candidate, evidence: lines(evidence) })} label="Assess Readiness" />
      </StudioSection>

      <StudioSection title="7 · Culture Replication" hint="Core values, one per line">
        <textarea value={values} onChange={(e) => setValues(e.target.value)} rows={2} className={ta} />
        <RunButton busy={busy} runKey="cult" onClick={() => run("cult", "/api/archon/culture", { values: lines(values) })} label="Build Culture Blueprint" />
      </StudioSection>

      <StudioSection title="8 · Awakener" hint="A task to connect to larger purpose">
        <input value={task} onChange={(e) => setTask(e.target.value)} className={ta} />
        <RunButton busy={busy} runKey="role" onClick={() => run("role", "/api/archon/role-plan", { context: [task] })} label="Role Transformation Plan" />
      </StudioSection>
    </div>
  );
}

