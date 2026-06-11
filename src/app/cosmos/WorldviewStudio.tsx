"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useTx } from "@/lib/i18n/client";

const ta = inputCls;
const DIMS = ["reality","humanNature","meaning","success","failure","responsibility","time","change","risk","purpose"] as const;


export default function WorldviewStudio() {
  const tx = useTx();
  const { busy, error, note, run } = useAgentRun();
  const out = note;
  const [dims, setDims] = useState<Record<string, number>>(Object.fromEntries(DIMS.map((d) => [d, 0.5])));
  const [statements, setStatements] = useState("");
  const [reflections, setReflections] = useState("");
  const [values, setValues] = useState("");
  const [wvA, setWvA] = useState("");
  const [wvB, setWvB] = useState("");
  const [lessons, setLessons] = useState("");


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">Worldview Studio</h2>
      <p className="mt-1 text-sm text-slate-400">Score your ten dimensions, surface hidden assumptions, construct meaning, simulate worldviews, and distill a personal philosophy. (Runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <StudioSection title="1 · Worldview Profile (10 dimensions)" hint="Rate the clarity/health of each stance, 0–1">
        <div className="grid grid-cols-2 gap-2">
          {DIMS.map((d) => (
            <label key={d} className="text-xs text-slate-400">{d}
              <input type="number" min={0} max={1} step={0.1} value={dims[d]} onChange={(e) => setDims({ ...dims, [d]: parseFloat(e.target.value) })} className={ta} />
            </label>
          ))}
        </div>
        <RunButton busy={busy} runKey="prof" onClick={() => run("prof", "/api/cosmos/profile", dims, (j) => `Global: ${Math.round((((j.profile as { globalScore: number })?.globalScore) ?? 0) * 100)}`)} label="Save Profile" />
      </StudioSection>

      <StudioSection title="2 · Assumption Detector" hint="Things you tell yourself — one per line">
        <textarea value={statements} onChange={(e) => setStatements(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="asm" onClick={() => run("asm", "/api/cosmos/assumptions", { statements: lines(statements) })} label="Surface Assumptions" />
      </StudioSection>

      <StudioSection title="3 · Meaning" hint="Reflections on what feels meaningful — one per line">
        <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="mng" onClick={() => run("mng", "/api/cosmos/meaning", { reflections: lines(reflections) })} label="Map Meaning" />
      </StudioSection>

      <StudioSection title="4 · Mission & Identity" hint="Your values (one per line) — generate mission + identity">
        <textarea value={values} onChange={(e) => setValues(e.target.value)} rows={2} className={ta} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="mis" onClick={() => run("mis", "/api/cosmos/telos", { values: lines(values) }, (j) => `${((j.candidates as unknown[]) || []).length} mission candidate(s) — see console`)} label="Generate Mission" />
          <RunButton busy={busy} runKey="idn" onClick={() => run("idn", "/api/cosmos/identity", {}, (j) => `${((j.identities as unknown[]) || []).length} identities suggested`)} label="Navigate Identity" />
        </div>
      </StudioSection>

      <StudioSection title="5 · Worldview Simulator" hint="Compare two worldviews' projected outcomes">
        <input value={wvA} onChange={(e) => setWvA(e.target.value)} className={ta} placeholder={tx("Worldview A (e.g. 'effort alone creates success')")} />
        <input value={wvB} onChange={(e) => setWvB(e.target.value)} className={ta} placeholder={tx("Worldview B (e.g. 'leverage and selection create success')")} />
        <RunButton busy={busy} runKey="sim" onClick={() => run("sim", "/api/cosmos/simulator", { worldviewA: wvA, worldviewB: wvB }, (j) => (j.contrast as string) || "Simulated")} label="Simulate" />
      </StudioSection>

      <StudioSection title="6 · Twin & Wisdom" hint="Detect drift and distill a personal philosophy">
        <textarea value={lessons} onChange={(e) => setLessons(e.target.value)} rows={2} className={ta} placeholder={tx("Recent behavior / lessons, one per line")} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="twin" onClick={() => run("twin", "/api/cosmos/twin", { recentBehavior: lines(lessons) }, (j) => ((j.twin as { driftDetected: boolean })?.driftDetected ? "Drift detected" : "No drift"))} label="Worldview Twin" />
          <RunButton busy={busy} runKey="wis" onClick={() => run("wis", "/api/cosmos/wisdom", { lessons: lines(lessons) })} label="Distill Philosophy" />
        </div>
      </StudioSection>
    </div>
  );
}

