"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

const ta = inputCls;


export default function ManagementStudio() {
  const tx = useTx();
  const T = useT();
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
      <h2 className="text-lg font-bold">{T("管理工作室", "Management Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">Assess maturity, redistribute leverage, capture knowledge, govern decisions, and stress-test resilience. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <StudioSection title="1 · Management Assessment" hint="Reflections on how you spend your week — one per line">
        <SuggestionField value={reflections} onChange={setReflections} rows={3} className={ta} chipLabel={T("复盘备选", "Reflection options")} suggestions={[T("我花太多时间处理重复协调。", "I spend too much time on repeated coordination."), T("关键决策仍依赖少数人。", "Key decisions still depend on a few people."), T("团队知道任务，但不知道判断标准。", "The team knows tasks but not decision standards.")]} />
        <RunButton busy={busy} runKey="assess" onClick={() => run("assess", "/api/oikos/assessment", { reflections: lines(reflections) })} label="Assess Maturity" />
      </StudioSection>

      <StudioSection title="2 · Leverage Analysis" hint="One activity per line, format: 'Activity: hours' (e.g. 'Status meetings: 10')">
        <SuggestionField value={activities} onChange={setActivities} rows={3} className={ta} chipLabel={T("活动备选", "Activity options")} suggestions={["Status meetings: 8", "Customer escalations: 6", "Founder approvals: 5"]} />
        <RunButton busy={busy} runKey="lev" onClick={() => run("lev", "/api/oikos/leverage", { activities: parseActivities(activities) })} label="Analyze Leverage" />
      </StudioSection>

      <StudioSection title="3 · Knowledge Capture (SECI)" hint="Topic + expert notes (one per line)">
        <SuggestionField as="input" value={topic} onChange={setTopic} className={ta} placeholder={tx("Topic (e.g. incident triage)")} chipLabel={T("主题备选", "Topic options")} suggestions={[T("客户交付复盘", "Customer delivery review"), T("售前诊断流程", "Pre-sales diagnosis workflow"), T("故障应急处理", "Incident triage")]} />
        <SuggestionField value={notes} onChange={setNotes} rows={2} className={ta} placeholder={tx("Tacit notes…")} chipLabel={T("经验备选", "Note options")} suggestions={[T("先确认责任边界，再判断技术方案。", "Clarify responsibility boundary before judging the technical solution."), T("每次升级问题必须留下证据日志。", "Every escalation must leave an evidence log."), T("客户真正关心的是恢复时间和后续预防。", "Customers care about recovery time and prevention.")]} />
        <RunButton busy={busy} runKey="cap" onClick={() => run("cap", "/api/oikos/knowledge/capture", { topic, notes: lines(notes) })} label="Capture → Playbook + Prompts" />
      </StudioSection>

      <StudioSection title="4 · Knowledge-Worker Effectiveness" hint="Signals about how work actually flows — one per line">
        <SuggestionField value={signals} onChange={setSignals} rows={2} className={ta} chipLabel={T("信号备选", "Signal options")} suggestions={[T("高价值工作被临时消息频繁打断。", "High-value work is frequently interrupted by ad hoc messages."), T("同一个问题被不同团队重复解决。", "The same problem is solved repeatedly by different teams."), T("文档存在，但决策上下文缺失。", "Docs exist, but decision context is missing.")]} />
        <RunButton busy={busy} runKey="kw" onClick={() => run("kw", "/api/oikos/knowledge/worker", { signals: lines(signals) })} label="Assess Effectiveness" />
      </StudioSection>

      <StudioSection title="5 · Alignment" hint="Observations on how the org actually behaves — one per line">
        <SuggestionField value={alignInputs} onChange={setAlignInputs} rows={2} className={ta} chipLabel={T("行为备选", "Behavior options")} suggestions={[T("销售承诺与交付能力不一致。", "Sales promises and delivery capacity are not aligned."), T("指标鼓励局部优化而非客户结果。", "Metrics encourage local optimization rather than customer outcomes."), T("战略说聚焦，但资源仍被分散。", "Strategy says focus, but resources remain scattered.")]} />
        <RunButton busy={busy} runKey="align" onClick={() => run("align", "/api/oikos/alignment", { inputs: lines(alignInputs) })} label="Measure Alignment" />
      </StudioSection>

      <StudioSection title="6 · Organizational Health" hint="Culture signals — one per line">
        <SuggestionField value={healthSignals} onChange={setHealthSignals} rows={2} className={ta} chipLabel={T("文化信号备选", "Culture signal options")} suggestions={[T("坏消息上报太晚。", "Bad news is reported too late."), T("复盘容易变成追责。", "Reviews easily turn into blame."), T("跨团队合作依赖私人关系。", "Cross-team work relies on personal relationships.")]} />
        <RunButton busy={busy} runKey="hl" onClick={() => run("hl", "/api/oikos/health", { signals: lines(healthSignals) })} label="Measure Health" />
      </StudioSection>

      <StudioSection title="7 · Decision Governance" hint="Recent decisions / patterns — one per line">
        <SuggestionField value={decisions} onChange={setDecisions} rows={2} className={ta} chipLabel={T("决策备选", "Decision options")} suggestions={[T("重大折扣没有复盘利润影响。", "Major discounts were not reviewed for margin impact."), T("项目优先级由声音最大的人决定。", "Project priority is decided by the loudest voice."), T("上线前缺少明确发布准备度标准。", "There is no clear release-readiness standard before launch.")]} />
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
        <SuggestionField as="input" value={scenario} onChange={setScenario} className={ta} placeholder={tx("Scenario (e.g. key engineer leaves)")} chipLabel={T("场景备选", "Scenario options")} suggestions={[T("关键负责人离职", "Key owner leaves"), T("最大客户延期付款", "Largest customer delays payment"), T("核心系统上线失败", "Core system launch fails")]} />
        <RunButton busy={busy} runKey="stress" onClick={() => run("stress", "/api/oikos/stress-test", { ...frag, scenario, context: [] })} label="Run Stress Test" />
      </StudioSection>

      <StudioSection title="9 · Organization Design" hint="Context about the current org — one per line">
        <SuggestionField value={designCtx} onChange={setDesignCtx} rows={2} className={ta} chipLabel={T("组织背景备选", "Org context options")} suggestions={[T("团队从 5 人扩到 20 人，职责边界开始模糊。", "The team grew from 5 to 20, and role boundaries are blurring."), T("需要从项目制转向产品化交付。", "We need to shift from project work to productized delivery."), T("客户成功、销售、产品之间缺少闭环。", "Customer success, sales, and product lack a closed loop.")]} />
        <RunButton busy={busy} runKey="des" onClick={() => run("des", "/api/oikos/design", { context: lines(designCtx) })} label="Design Organization" />
      </StudioSection>

      <StudioSection title="10 · Management Digital Twin" hint="Simulate a change against your modeled org">
        <SuggestionField as="input" value={scenario} onChange={setScenario} className={ta} placeholder={tx("Scenario to simulate")} chipLabel={T("模拟备选", "Simulation options")} suggestions={[T("把审批权下放给一线负责人", "Delegate approval rights to frontline owners"), T("将周会改为书面周报", "Replace weekly meetings with written weekly updates"), T("新增一个客户成功负责人", "Add one customer success owner")]} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="twin" onClick={() => run("twin", "/api/oikos/twin/simulate", { scenario })} label="Simulate Twin" />
          <RunButton busy={busy} runKey="coach" onClick={() => run("coach", "/api/oikos/coaching", { context: lines(reflections) })} label="Coaching Plan" />
        </div>
      </StudioSection>
    </div>
  );
}
