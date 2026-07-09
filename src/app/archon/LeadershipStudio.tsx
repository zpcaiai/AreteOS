"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { ROLES } from "@/lib/archon/levels";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

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
        <SuggestionField value={inputs} onChange={setInputs} rows={3} className={ta} chipLabel={T("输入备选", "Input options")} suggestions={[T("一线负责人反复等待我确认。", "Frontline owners repeatedly wait for my confirmation."), T("团队会议在同步信息，少有清晰决策。", "Team meetings synchronize information but produce few clear decisions."), T("关键客户问题需要跨团队快速协同。", "Key customer issues need fast cross-team coordination.")]} />
        <RunButton busy={busy} runKey="lev" onClick={() => run("lev", "/api/archon/leverage-map", { inputs: lines(inputs) })} label="Map Leverage" />
      </StudioSection>

      <StudioSection title="2 · Vision" hint="Your mission (the vision is generated and aligned)">
        <SuggestionField as="input" value={mission} onChange={setMission} className={ta} chipLabel={T("使命备选", "Mission options")} suggestions={[T("让团队用证据和复盘持续交付真实客户结果。", "Help the team continuously deliver real customer outcomes through evidence and review."), T("把个人经验变成组织可复制的能力。", "Turn individual experience into repeatable organizational capability."), T("建立高信任、高标准、低内耗的执行系统。", "Build a high-trust, high-standard, low-friction execution system.")]} />
        <RunButton busy={busy} runKey="vis" onClick={() => run("vis", "/api/archon/vision", { mission })} label="Create / Align Vision" />
      </StudioSection>

      <StudioSection title="3 · Belonging" hint="One team signal per line">
        <SuggestionField value={signals} onChange={setSignals} rows={3} className={ta} chipLabel={T("团队信号备选", "Team signal options")} suggestions={[T("新人不敢暴露不知道的地方。", "New people hesitate to reveal what they do not know."), T("跨团队问题经常被推回去。", "Cross-team problems are often pushed back."), T("大家愿意帮忙，但缺少共同标准。", "People are willing to help, but lack shared standards.")]} />
        <RunButton busy={busy} runKey="bel" onClick={() => run("bel", "/api/archon/belonging", { signals: lines(signals) })} label="Assess Belonging" />
      </StudioSection>

      <StudioSection title="4 · Organizational Alignment" hint="One observation about how the org actually behaves, per line">
        <SuggestionField value={alignInputs} onChange={setAlignInputs} rows={3} className={ta} chipLabel={T("组织观察备选", "Org observation options")} suggestions={[T("公司说客户第一，但内部指标奖励短期签单。", "The company says customer first, but metrics reward short-term deals."), T("战略重点很多，资源没有随之收束。", "There are many strategic priorities, but resources are not focused."), T("负责人有目标，但没有对应决策权。", "Owners have goals but not matching decision rights.")]} />
        <RunButton busy={busy} runKey="align" onClick={() => run("align", "/api/archon/alignment", { inputs: lines(alignInputs) })} label="Measure Alignment" />
      </StudioSection>

      <StudioSection title="5 · Identity Sponsorship & Conversations" hint="Pick a role and describe the situation">
        <select value={role} onChange={(e) => setRole(e.target.value)} className={ta}>
          {ROLES.map((r) => <option key={r.role} value={r.role}>{r.role} — {r.mindset}</option>)}
        </select>
        <SuggestionField value={situation} onChange={setSituation} rows={2} className={ta} placeholder={tx("Situation…")} chipLabel={T("对话场景备选", "Conversation options")} suggestions={[T("负责人交付延期，但没有提前暴露风险。", "An owner missed delivery and did not surface risk early."), T("团队成员有潜力，但一直等待明确指令。", "A team member has potential but keeps waiting for explicit instructions."), T("跨部门合作出现防御和推责。", "Cross-functional work is defensive and blame-shifting.")]} />
        <RunButton busy={busy} runKey="conv" onClick={() => run("conv", "/api/archon/conversation", { role, situation })} label="Generate Conversation Script" />
      </StudioSection>

      <StudioSection title="6 · Future Leaders" hint="Candidate + evidence (one per line)">
        <SuggestionField as="input" value={candidate} onChange={setCandidate} className={ta} placeholder={tx("Candidate name")} chipLabel={T("候选人备选", "Candidate options")} suggestions={[T("项目负责人 A", "Project owner A"), T("客户成功负责人", "Customer success lead"), T("资深交付顾问", "Senior delivery consultant")]} />
        <SuggestionField value={evidence} onChange={setEvidence} rows={2} className={ta} placeholder={tx("Evidence…")} chipLabel={T("证据备选", "Evidence options")} suggestions={[T("能提前暴露风险并提出备选方案。", "Surfaces risk early and proposes alternatives."), T("能把模糊需求整理成清晰交付计划。", "Turns ambiguous needs into a clear delivery plan."), T("能在冲突中保护客户结果而非个人面子。", "Protects customer outcomes over personal ego in conflict.")]} />
        <RunButton busy={busy} runKey="fut" onClick={() => run("fut", "/api/archon/future-leader", { candidate, evidence: lines(evidence) })} label="Assess Readiness" />
      </StudioSection>

      <StudioSection title="7 · Culture Replication" hint="Core values, one per line">
        <SuggestionField value={values} onChange={setValues} rows={2} className={ta} chipLabel={T("文化备选", "Culture options")} suggestions={[T("客户结果优先", "Customer outcomes first"), T("提前暴露风险", "Surface risk early"), T("复盘不追责，标准不降低", "Review without blame; do not lower standards")]} />
        <RunButton busy={busy} runKey="cult" onClick={() => run("cult", "/api/archon/culture", { values: lines(values) })} label="Build Culture Blueprint" />
      </StudioSection>

      <StudioSection title="8 · Awakener" hint="A task to connect to larger purpose">
        <SuggestionField as="input" value={task} onChange={setTask} className={ta} chipLabel={T("任务备选", "Task options")} suggestions={[T("完成一次客户复盘", "Complete one customer review"), T("培养一个项目负责人", "Develop one project owner"), T("把交付标准写成清单", "Turn delivery standards into a checklist")]} />
        <RunButton busy={busy} runKey="role" onClick={() => run("role", "/api/archon/role-plan", { context: [task] })} label="Role Transformation Plan" />
      </StudioSection>
    </div>
  );
}
