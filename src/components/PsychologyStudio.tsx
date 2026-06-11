"use client";
import { useState } from "react";
import { inputCls, StudioShell, StudioSection, RunButton, useAgentRun } from "./studio";
import { useTx } from "@/lib/i18n/client";

type Json = Record<string, unknown>;

function Result({ data }: { data: Json | null }) {
  const tx = useTx();
  if (!data) return null;
  return (
    <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/** Runs the seven migrated psychology agents (POST /api/agents/:name). DB-free. */
export default function PsychologyStudio() {
  const tx = useTx();
  const { busy, error, run } = useAgentRun();
  const [out, setOut] = useState<Record<string, Json | null>>({});
  const call = async (name: string, body: unknown) => {
    const json = await run(name, `/api/agents/${name}`, body);
    if (json) setOut((o) => ({ ...o, [name]: (json.output as Json) ?? json }));
  };

  // local field state
  const [event, setEvent] = useState("");
  const [thought, setThought] = useState("");
  const [surface, setSurface] = useState("");
  const [story, setStory] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [task, setTask] = useState("");
  const [energy, setEnergy] = useState(3);
  const [decision, setDecision] = useState("");
  const [emo, setEmo] = useState("");

  return (
    <StudioShell
      title="Psychology Studio"
      intro="Evidence-based engines migrated from emotion-sphere: CBT reframing, personality drivers, narrative identity, state, behavioral activation, decision-motive, growth. Not diagnosis."
      error={error}
    >
      <div className="mt-4 grid grid-cols-1 gap-3">
        <StudioSection title="CBT reframe (Beck ABC)" hint="Map a thought's belief hierarchy and reframe it." open>
          <input className={inputCls} placeholder={tx("Activating event…")} value={event} onChange={(e) => setEvent(e.target.value)} />
          <input className={`${inputCls} mt-2`} placeholder={tx("Automatic thought (optional)")} value={thought} onChange={(e) => setThought(e.target.value)} />
          <RunButton busy={busy} runKey="CbtReframe" label="Reframe" onClick={() => call("CbtReframe", { activatingEvent: event, automaticThought: thought })} />
          <Result data={out.CbtReframe} />
        </StudioSection>

        <StudioSection title="Personality driver (L0)" hint="Trace a complaint to its deep driver + loop.">
          <input className={inputCls} placeholder={tx("Surface problem…")} value={surface} onChange={(e) => setSurface(e.target.value)} />
          <RunButton busy={busy} runKey="PersonalityDriver" label="Trace driver" onClick={() => call("PersonalityDriver", { surfaceProblem: surface })} />
          <Result data={out.PersonalityDriver} />
        </StudioSection>

        <StudioSection title="Narrative identity (McAdams)" hint="Classify a life-story reflection.">
          <textarea className={inputCls} rows={3} placeholder={tx("A life-story reflection…")} value={story} onChange={(e) => setStory(e.target.value)} />
          <RunButton busy={busy} runKey="NarrativeIdentity" label="Classify narrative" onClick={() => call("NarrativeIdentity", { history: story.split("\n").filter(Boolean) })} />
          <Result data={out.NarrativeIdentity} />
        </StudioSection>

        <StudioSection title="State check-in (L2)" hint="Snapshot of current psychological state + a micro-action.">
          <input className={inputCls} placeholder={tx("How are you right now?")} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <RunButton busy={busy} runKey="StateAssessment" label="Assess state" onClick={() => call("StateAssessment", { checkIn })} />
          <Result data={out.StateAssessment} />
        </StudioSection>

        <StudioSection title="Behavioral activation" hint="Adapt a task to your current energy (Green/Yellow/Red).">
          <input className={inputCls} placeholder={tx("Task…")} value={task} onChange={(e) => setTask(e.target.value)} />
          <label className="mt-2 block text-xs text-slate-400">Energy: {energy}/5</label>
          <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full" />
          <RunButton busy={busy} runKey="BehaviorRegulation" label="Regulate" onClick={() => call("BehaviorRegulation", { task, energyLevel: energy })} />
          <Result data={out.BehaviorRegulation} />
        </StudioSection>

        <StudioSection title="Decision motive + guidance" hint="Surface the motive behind a pending decision.">
          <input className={inputCls} placeholder={tx("Pending decision…")} value={decision} onChange={(e) => setDecision(e.target.value)} />
          <input className={`${inputCls} mt-2`} placeholder={tx("Emotional context (optional)")} value={emo} onChange={(e) => setEmo(e.target.value)} />
          <RunButton busy={busy} runKey="DecisionMotiveGuide" label="Analyze motive" onClick={() => call("DecisionMotiveGuide", { decision, emotionalContext: emo })} />
          <Result data={out.DecisionMotiveGuide} />
        </StudioSection>
      </div>
    </StudioShell>
  );
}
