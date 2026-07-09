"use client";
import { useState } from "react";
import { inputCls, StudioShell, StudioSection, RunButton, useAgentRun } from "./studio";
import { useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

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
          <SuggestionField as="input" className={inputCls} placeholder={tx("Activating event…")} value={event} onChange={setEvent} chipLabel={tx("事件备选")} suggestions={[tx("会议中被质疑后沉默了"), tx("发布前反复拖延"), tx("用户没有回复后开始自我否定")]} />
          <div className="mt-2"><SuggestionField as="input" className={inputCls} placeholder={tx("Automatic thought (optional)")} value={thought} onChange={setThought} chipLabel={tx("想法备选")} suggestions={[tx("我肯定不够好"), tx("这一定会失败"), tx("别人会觉得我很业余")]} /></div>
          <RunButton busy={busy} runKey="CbtReframe" label="Reframe" onClick={() => call("CbtReframe", { activatingEvent: event, automaticThought: thought })} />
          <Result data={out.CbtReframe} />
        </StudioSection>

        <StudioSection title="Personality driver (L0)" hint="Trace a complaint to its deep driver + loop.">
          <SuggestionField as="input" className={inputCls} placeholder={tx("Surface problem…")} value={surface} onChange={setSurface} chipLabel={tx("问题备选")} suggestions={[tx("我总是拖延关键任务"), tx("我害怕暴露不成熟的版本"), tx("我很难拒绝无关请求")]} />
          <RunButton busy={busy} runKey="PersonalityDriver" label="Trace driver" onClick={() => call("PersonalityDriver", { surfaceProblem: surface })} />
          <Result data={out.PersonalityDriver} />
        </StudioSection>

        <StudioSection title="Narrative identity (McAdams)" hint="Classify a life-story reflection.">
          <SuggestionField className={inputCls} rows={3} placeholder={tx("A life-story reflection…")} value={story} onChange={setStory} chipLabel={tx("反思备选")} suggestions={[tx("我过去常把失败理解成能力不足，现在想把它看成证据收集。"), tx("我最有能量的时候，是把复杂事情做成清晰系统。"), tx("我希望自己的故事从独自扛事，转向可复制地带人完成结果。")]} />
          <RunButton busy={busy} runKey="NarrativeIdentity" label="Classify narrative" onClick={() => call("NarrativeIdentity", { history: story.split("\n").filter(Boolean) })} />
          <Result data={out.NarrativeIdentity} />
        </StudioSection>

        <StudioSection title="State check-in (L2)" hint="Snapshot of current psychological state + a micro-action.">
          <SuggestionField as="input" className={inputCls} placeholder={tx("How are you right now?")} value={checkIn} onChange={setCheckIn} chipLabel={tx("状态备选")} suggestions={[tx("有点焦虑，但还能做一个小动作"), tx("精力低，只适合 5 分钟行动"), tx("状态稳定，可以推进 25 分钟深度任务")]} />
          <RunButton busy={busy} runKey="StateAssessment" label="Assess state" onClick={() => call("StateAssessment", { checkIn })} />
          <Result data={out.StateAssessment} />
        </StudioSection>

        <StudioSection title="Behavioral activation" hint="Adapt a task to your current energy (Green/Yellow/Red).">
          <SuggestionField as="input" className={inputCls} placeholder={tx("Task…")} value={task} onChange={setTask} chipLabel={tx("任务备选")} suggestions={[tx("联系一位潜在用户"), tx("发布一个最小资产"), tx("整理一条可验证假设")]} />
          <label className="mt-2 block text-xs text-slate-400">Energy: {energy}/5</label>
          <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full" />
          <RunButton busy={busy} runKey="BehaviorRegulation" label="Regulate" onClick={() => call("BehaviorRegulation", { task, energyLevel: energy })} />
          <Result data={out.BehaviorRegulation} />
        </StudioSection>

        <StudioSection title="Decision motive + guidance" hint="Surface the motive behind a pending decision.">
          <SuggestionField as="input" className={inputCls} placeholder={tx("Pending decision…")} value={decision} onChange={setDecision} chipLabel={tx("决策备选")} suggestions={[tx("是否今天就发布收费页"), tx("是否砍掉一个低价值功能"), tx("是否把项目授权给负责人")]} />
          <div className="mt-2"><SuggestionField as="input" className={inputCls} placeholder={tx("Emotional context (optional)")} value={emo} onChange={setEmo} chipLabel={tx("情绪备选")} suggestions={[tx("担心被拒绝"), tx("害怕错过机会"), tx("想证明自己没做错")]} /></div>
          <RunButton busy={busy} runKey="DecisionMotiveGuide" label="Analyze motive" onClick={() => call("DecisionMotiveGuide", { decision, emotionalContext: emo })} />
          <Result data={out.DecisionMotiveGuide} />
        </StudioSection>
      </div>
    </StudioShell>
  );
}
