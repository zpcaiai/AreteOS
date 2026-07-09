"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

const ta = inputCls;
const DIMS = ["reality","humanNature","meaning","success","failure","responsibility","time","change","risk","purpose"] as const;
const DIM_ZH: Record<string, string> = { reality: "现实", humanNature: "人性", meaning: "意义", success: "成功", failure: "失败", responsibility: "责任", time: "时间", change: "变化", risk: "风险", purpose: "目的" };


export default function WorldviewStudio() {
  const tx = useTx();
  const T = useT();
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
      <h2 className="text-lg font-bold">{T("世界观工作室", "Worldview Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">{T("为你的十个维度打分、揭示隐藏假设、构建意义、模拟世界观,并提炼个人哲学。(离线用 mock AI 运行。)", "Score your ten dimensions, surface hidden assumptions, construct meaning, simulate worldviews, and distill a personal philosophy. (Runs offline on mock AI.)")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <StudioSection title="1 · Worldview Profile (10 dimensions)" hint="Rate the clarity/health of each stance, 0–1">
        <div className="grid grid-cols-2 gap-2">
          {DIMS.map((d) => (
            <label key={d} className="text-xs text-slate-400">{T(DIM_ZH[d] ?? d, d)}
              <input type="number" min={0} max={1} step={0.1} value={dims[d]} onChange={(e) => setDims({ ...dims, [d]: parseFloat(e.target.value) })} className={ta} />
            </label>
          ))}
        </div>
        <RunButton busy={busy} runKey="prof" onClick={() => run("prof", "/api/cosmos/profile", dims, (j) => `Global: ${Math.round((((j.profile as { globalScore: number })?.globalScore) ?? 0) * 100)}`)} label="Save Profile" />
      </StudioSection>

      <StudioSection title="2 · Assumption Detector" hint="Things you tell yourself — one per line">
        <SuggestionField value={statements} onChange={setStatements} rows={3} className={ta} chipLabel={T("假设备选", "Assumption options")} suggestions={[T("只要我再多做功能，用户自然会付费。", "If I build more features, users will naturally pay."), T("失败说明我还不够强。", "Failure means I am not strong enough yet."), T("真正重要的事情必须一次想清楚再开始。", "Important things must be fully figured out before starting.")]} />
        <RunButton busy={busy} runKey="asm" onClick={() => run("asm", "/api/cosmos/assumptions", { statements: lines(statements) })} label="Surface Assumptions" />
      </StudioSection>

      <StudioSection title="3 · Meaning" hint="Reflections on what feels meaningful — one per line">
        <SuggestionField value={reflections} onChange={setReflections} rows={3} className={ta} chipLabel={T("意义备选", "Meaning options")} suggestions={[T("我在帮助别人看清复杂问题时最有意义感。", "I feel meaning when helping others clarify complex problems."), T("我想把零散经验变成可传承的方法。", "I want to turn scattered experience into transferable methods."), T("我希望自己的工作留下长期资产，而不是短期忙碌。", "I want my work to leave long-term assets, not short-term busyness.")]} />
        <RunButton busy={busy} runKey="mng" onClick={() => run("mng", "/api/cosmos/meaning", { reflections: lines(reflections) })} label="Map Meaning" />
      </StudioSection>

      <StudioSection title="4 · Mission & Identity" hint="Your values (one per line) — generate mission + identity">
        <SuggestionField value={values} onChange={setValues} rows={2} className={ta} chipLabel={T("价值备选", "Value options")} suggestions={[T("真实", "Truthfulness"), T("长期主义", "Long-termism"), T("可复制贡献", "Repeatable contribution")]} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="mis" onClick={() => run("mis", "/api/cosmos/telos", { values: lines(values) }, (j) => `${((j.candidates as unknown[]) || []).length} mission candidate(s) — see console`)} label="Generate Mission" />
          <RunButton busy={busy} runKey="idn" onClick={() => run("idn", "/api/cosmos/identity", {}, (j) => `${((j.identities as unknown[]) || []).length} identities suggested`)} label="Navigate Identity" />
        </div>
      </StudioSection>

      <StudioSection title="5 · Worldview Simulator" hint="Compare two worldviews' projected outcomes">
        <SuggestionField as="input" value={wvA} onChange={setWvA} className={ta} placeholder={tx("Worldview A (e.g. 'effort alone creates success')")} chipLabel={T("世界观 A", "Worldview A")} suggestions={[T("努力本身创造成功", "Effort alone creates success"), T("先完整设计再行动", "Design fully before acting"), T("安全来自不犯错", "Safety comes from avoiding mistakes")]} />
        <SuggestionField as="input" value={wvB} onChange={setWvB} className={ta} placeholder={tx("Worldview B (e.g. 'leverage and selection create success')")} chipLabel={T("世界观 B", "Worldview B")} suggestions={[T("杠杆和选择创造复利", "Leverage and selection create compounding"), T("小实验产生真实信息", "Small experiments create real information"), T("安全来自可恢复系统", "Safety comes from recoverable systems")]} />
        <RunButton busy={busy} runKey="sim" onClick={() => run("sim", "/api/cosmos/simulator", { worldviewA: wvA, worldviewB: wvB }, (j) => (j.contrast as string) || "Simulated")} label="Simulate" />
      </StudioSection>

      <StudioSection title="6 · Twin & Wisdom" hint="Detect drift and distill a personal philosophy">
        <SuggestionField value={lessons} onChange={setLessons} rows={2} className={ta} placeholder={tx("Recent behavior / lessons, one per line")} chipLabel={T("教训备选", "Lesson options")} suggestions={[T("我继续堆功能时，往往是在回避用户验证。", "When I keep adding features, I am often avoiding user validation."), T("真正推动进展的是留下证据的行动。", "Actions that leave evidence are what move progress."), T("范围越大，越需要先定义今天唯一行动。", "The bigger the scope, the more I need one action for today.")]} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="twin" onClick={() => run("twin", "/api/cosmos/twin", { recentBehavior: lines(lessons) }, (j) => ((j.twin as { driftDetected: boolean })?.driftDetected ? "Drift detected" : "No drift"))} label="Worldview Twin" />
          <RunButton busy={busy} runKey="wis" onClick={() => run("wis", "/api/cosmos/wisdom", { lessons: lines(lessons) })} label="Distill Philosophy" />
        </div>
      </StudioSection>
    </div>
  );
}
