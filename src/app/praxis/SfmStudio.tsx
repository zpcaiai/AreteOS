"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT } from "@/lib/i18n/client";

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

const FOUNDER_QUESTIONS_ZH = [
  "你为什么创办这家公司?",
  "哪些客户痛点你比别人理解得更深?",
  "哪些决策带来了最大的突破?",
  "你绝不妥协的是什么?",
  "什么样的人能在你公司成功?",
  "什么样的人在你公司会失败?",
  "你最强的直觉是什么?",
  "你什么时候会用判断力推翻数据?",
  "哪些重复的行为造就了成功?",
  "哪些风险曾差点让公司倒闭?",
  "员工常误解你的哪些标准?",
  "公司扩张时哪些东西绝不能变?",
  "公司扩张时哪些东西必须改变?",
  "哪些决策仍然过度依赖你?",
  "如果你消失 90 天,什么会崩掉?",
];

export default function SfmStudio() {
  const { busy, error, run } = useAgentRun();
  const T = useT();
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
      <p className="mt-1 text-sm text-slate-400">{T("逐个模块运行:为创始人建模、提取成功要素、生成可复制的操作手册。(Pro 功能——可离线用 mock AI 运行。)", "Run each module to model the founder, extract success factors, and generate the replication playbook. (Pro feature — runs offline on mock AI.)")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <details className="mt-4 rounded-lg border border-slate-800 p-3" open>
        <summary className="cursor-pointer text-sm font-semibold">{T("1 · 创始人 DNA 访谈", "1 · Founder DNA Interview")}</summary>
        <div className="mt-3 space-y-2">
          {FOUNDER_QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="text-xs text-slate-400">{i + 1}. {T(FOUNDER_QUESTIONS_ZH[i], q)}</label>
              <input value={answers[i]} onChange={(e) => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm" />
            </div>
          ))}
          <button disabled={busy !== null}
            onClick={() => run("founder", "/api/praxis/founder/extract", { answers: FOUNDER_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })).filter((a) => a.answer) })}
            className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">
            {busy === "founder" ? T("提取中…", "Extracting…") : T("提取创始人 DNA", "Extract Founder DNA")}
          </button>
        </div>
      </details>

      <StudioSection title={T("2 · 成功要素", "2 · Success Factors")} hint={T("每行一个成就/里程碑", "One win / milestone per line")}>
        <textarea value={wins} onChange={(e) => setWins(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="factors" onClick={() => run("factors", "/api/praxis/success-factors/analyze", { wins: lines(wins) })} label={T("为成功要素建模", "Model Success Factors")} />
      </StudioSection>

      <StudioSection title={T("3 · 公司身份", "3 · Company Identity")} hint={T("公司的使命是什么?", "What is the company's mission?")}>
        <input value={mission} onChange={(e) => setMission(e.target.value)} className={ta} />
        <RunButton busy={busy} runKey="identity" onClick={() => run("identity", "/api/praxis/company-identity/build", { mission })} label={T("构建公司身份", "Build Company Identity")} />
      </StudioSection>

      <StudioSection title={T("4 · 价值观", "4 · Values")} hint={T("每行一个创始人价值观", "One founder value per line")}>
        <textarea value={founderVals} onChange={(e) => setFounderVals(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="values" onClick={() => run("values", "/api/praxis/values/extract", { founderValues: lines(founderVals) })} label={T("提取并排序价值观", "Extract & Rank Values")} />
      </StudioSection>

      <StudioSection title={T("5 · 决策规则与运营原则", "5 · Decision Rules & Operating Principles")} hint={T("每行一个过去的决策", "One past decision per line")}>
        <textarea value={decisions} onChange={(e) => setDecisions(e.target.value)} rows={3} className={ta} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="rules" onClick={() => run("rules", "/api/praxis/decision-rules/extract", { decisions: lines(decisions) })} label={T("编码决策规则", "Encode Decision Rules")} />
          <RunButton busy={busy} runKey="principles" onClick={() => run("principles", "/api/praxis/operating-principles/create", { values: lines(founderVals), decisionRules: lines(decisions) })} label={T("构建运营原则", "Build Operating Principles")} />
        </div>
      </StudioSection>

      <StudioSection title={T("6 · 协作", "6 · Collaboration")} hint={T("每行一个团队观察", "One team observation per line")}>
        <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="collab" onClick={() => run("collab", "/api/praxis/collaboration/analyze", { observations: lines(obs) })} label={T("分析协作", "Analyze Collaboration")} />
      </StudioSection>

      <StudioSection title={T("7 · 自觉领导力", "7 · Conscious Leadership")} hint={T("每行一个领导力复盘", "One leadership reflection per line")}>
        <textarea value={reflections} onChange={(e) => setReflections(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="lead" onClick={() => run("lead", "/api/praxis/archon/analyze", { reflections: lines(reflections) })} label={T("评估领导力", "Assess Leadership")} />
      </StudioSection>

      <StudioSection title={T("8 · 韧性", "8 · Resilience")} hint={T("每行一个背景事实(现金跑道、关键人物等)", "One context fact per line (runway, key people, etc.)")}>
        <textarea value={ctx} onChange={(e) => setCtx(e.target.value)} rows={3} className={ta} />
        <RunButton busy={busy} runKey="res" onClick={() => run("res", "/api/praxis/resilience/stress-test", { context: lines(ctx) })} label={T("压力测试", "Stress-Test")} />
      </StudioSection>

      <StudioSection title={T("9 · 复制手册", "9 · Replication Playbook")} hint={T("根据你建模的要素生成手册与蓝图", "Generates the playbook + blueprint from your modeled factors")}>
        <RunButton busy={busy} runKey="play" onClick={() => run("play", "/api/praxis/playbook/generate", { successFactors: lines(wins), bottlenecks: [] })} label={T("生成复制手册", "Generate Replication Playbook")} />
      </StudioSection>
    </div>
  );
}

const ta = inputCls;


