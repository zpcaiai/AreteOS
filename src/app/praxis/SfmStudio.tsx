"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

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
      <h2 className="text-lg font-bold">{T("SFM 工作室", "SFM Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">{T("逐个模块运行:为创始人建模、提取成功要素、生成可复制的操作手册。(Pro 功能——可离线用 mock AI 运行。)", "Run each module to model the founder, extract success factors, and generate the replication playbook. (Pro feature — runs offline on mock AI.)")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}

      <details className="mt-4 rounded-lg border border-slate-800 p-3" open>
        <summary className="cursor-pointer text-sm font-semibold">{T("1 · 创始人 DNA 访谈", "1 · Founder DNA Interview")}</summary>
        <div className="mt-3 space-y-2">
          {FOUNDER_QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="text-xs text-slate-400">{i + 1}. {T(FOUNDER_QUESTIONS_ZH[i], q)}</label>
              <SuggestionField
                as="input"
                value={answers[i]}
                onChange={(value) => { const a = [...answers]; a[i] = value; setAnswers(a); }}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
                chipLabel={T("回答备选", "Answer options")}
                suggestions={[
                  T("最关键的是客户真实愿意付费的痛点。", "The key is the customer pain people truly pay for."),
                  T("我们靠更快的验证和更高质量的交付取得突破。", "We broke through with faster validation and higher-quality delivery."),
                  T("不能妥协的是长期信任、证据和交付结果。", "We do not compromise on trust, evidence, and delivered outcomes."),
                ]}
              />
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
        <SuggestionField value={wins} onChange={setWins} rows={3} className={ta} chipLabel={T("里程碑备选", "Milestone options")} suggestions={[T("第一个客户愿意付费试点", "First customer willing to pay for a pilot"), T("团队把交付流程标准化", "Team standardized the delivery workflow"), T("一个渠道带来稳定线索", "One channel generated steady leads")]} />
        <RunButton busy={busy} runKey="factors" onClick={() => run("factors", "/api/praxis/success-factors/analyze", { wins: lines(wins) })} label={T("为成功要素建模", "Model Success Factors")} />
      </StudioSection>

      <StudioSection title={T("3 · 公司身份", "3 · Company Identity")} hint={T("公司的使命是什么?", "What is the company's mission?")}>
        <SuggestionField as="input" value={mission} onChange={setMission} className={ta} chipLabel={T("使命备选", "Mission options")} suggestions={[T("帮助客户把复杂业务变成可复制的系统。", "Help customers turn complex business into repeatable systems."), T("用 AI 和证据提升组织的判断与交付质量。", "Use AI and evidence to improve organizational judgment and delivery."), T("让小团队也能完成大公司级别的专业交付。", "Let small teams deliver with enterprise-grade professionalism.")]} />
        <RunButton busy={busy} runKey="identity" onClick={() => run("identity", "/api/praxis/company-identity/build", { mission })} label={T("构建公司身份", "Build Company Identity")} />
      </StudioSection>

      <StudioSection title={T("4 · 价值观", "4 · Values")} hint={T("每行一个创始人价值观", "One founder value per line")}>
        <SuggestionField value={founderVals} onChange={setFounderVals} rows={3} className={ta} chipLabel={T("价值观备选", "Value options")} suggestions={[T("真实结果优先于表面热闹", "Real outcomes over surface activity"), T("长期信任优先于短期成交", "Long-term trust over short-term closing"), T("用证据复盘，不用情绪定罪", "Review with evidence, not blame")]} />
        <RunButton busy={busy} runKey="values" onClick={() => run("values", "/api/praxis/values/extract", { founderValues: lines(founderVals) })} label={T("提取并排序价值观", "Extract & Rank Values")} />
      </StudioSection>

      <StudioSection title={T("5 · 决策规则与运营原则", "5 · Decision Rules & Operating Principles")} hint={T("每行一个过去的决策", "One past decision per line")}>
        <SuggestionField value={decisions} onChange={setDecisions} rows={3} className={ta} chipLabel={T("决策备选", "Decision options")} suggestions={[T("先签一个小额试点，再扩大投入。", "Sign a small paid pilot before expanding investment."), T("砍掉没有用户证据的功能。", "Cut features without user evidence."), T("把关键经验写成检查清单再交给团队。", "Turn key experience into a checklist before delegating.")]} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="rules" onClick={() => run("rules", "/api/praxis/decision-rules/extract", { decisions: lines(decisions) })} label={T("编码决策规则", "Encode Decision Rules")} />
          <RunButton busy={busy} runKey="principles" onClick={() => run("principles", "/api/praxis/operating-principles/create", { values: lines(founderVals), decisionRules: lines(decisions) })} label={T("构建运营原则", "Build Operating Principles")} />
        </div>
      </StudioSection>

      <StudioSection title={T("6 · 协作", "6 · Collaboration")} hint={T("每行一个团队观察", "One team observation per line")}>
        <SuggestionField value={obs} onChange={setObs} rows={3} className={ta} chipLabel={T("观察备选", "Observation options")} suggestions={[T("信息集中在创始人手里，团队等待指令。", "Information is concentrated with the founder; the team waits for instructions."), T("会议很多，但责任人与截止时间不清楚。", "Many meetings, but owners and deadlines are unclear."), T("复盘常停留在感受，没有证据日志。", "Reviews stay at feelings without evidence logs.")]} />
        <RunButton busy={busy} runKey="collab" onClick={() => run("collab", "/api/praxis/collaboration/analyze", { observations: lines(obs) })} label={T("分析协作", "Analyze Collaboration")} />
      </StudioSection>

      <StudioSection title={T("7 · 自觉领导力", "7 · Conscious Leadership")} hint={T("每行一个领导力复盘", "One leadership reflection per line")}>
        <SuggestionField value={reflections} onChange={setReflections} rows={3} className={ta} chipLabel={T("复盘备选", "Reflection options")} suggestions={[T("我在压力下会亲自接管，而不是训练负责人。", "Under pressure I take over instead of training owners."), T("我需要把标准说清楚，而不是期待团队自己理解。", "I need to make standards explicit instead of expecting the team to infer them."), T("我把速度误认为质量，忽略了复盘。", "I confuse speed with quality and skip review.")]} />
        <RunButton busy={busy} runKey="lead" onClick={() => run("lead", "/api/praxis/archon/analyze", { reflections: lines(reflections) })} label={T("评估领导力", "Assess Leadership")} />
      </StudioSection>

      <StudioSection title={T("8 · 韧性", "8 · Resilience")} hint={T("每行一个背景事实(现金跑道、关键人物等)", "One context fact per line (runway, key people, etc.)")}>
        <SuggestionField value={ctx} onChange={setCtx} rows={3} className={ta} chipLabel={T("压力事实备选", "Stress facts")} suggestions={[T("现金流只能支持 4 个月。", "Cash runway supports only 4 months."), T("关键客户集中度过高。", "Customer concentration is too high."), T("交付知识主要掌握在一名核心成员手里。", "Delivery knowledge is concentrated in one core person.")]} />
        <RunButton busy={busy} runKey="res" onClick={() => run("res", "/api/praxis/resilience/stress-test", { context: lines(ctx) })} label={T("压力测试", "Stress-Test")} />
      </StudioSection>

      <StudioSection title={T("9 · 复制手册", "9 · Replication Playbook")} hint={T("根据你建模的要素生成手册与蓝图", "Generates the playbook + blueprint from your modeled factors")}>
        <RunButton busy={busy} runKey="play" onClick={() => run("play", "/api/praxis/playbook/generate", { successFactors: lines(wins), bottlenecks: [] })} label={T("生成复制手册", "Generate Replication Playbook")} />
      </StudioSection>
    </div>
  );
}

const ta = inputCls;

