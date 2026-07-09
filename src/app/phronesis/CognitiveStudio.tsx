"use client";
import { useState } from "react";
import { useAgentRun, inputCls, lines, StudioSection, RunButton } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

const ta = inputCls;


export default function CognitiveStudio() {
  const tx = useTx();
  const T = useT();
  const { busy, error, note, run } = useAgentRun();
  const out = note;
  const [goal, setGoal] = useState("");
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [reflections, setReflections] = useState("");
  const [journal, setJournal] = useState("");
  const [situation, setSituation] = useState("");
  const [problem, setProblem] = useState("");
  const [lessons, setLessons] = useState("");


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("认知工作室", "Cognitive Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">Build a latticework, run decisions through lenses, detect biases, journal & review, reason under uncertainty, diagnose problems, and distill wisdom. (Pro feature — runs offline on mock AI.)</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <StudioSection title="1 · Build a Latticework" hint="A goal — get a diverse model network + blind spots">
        <SuggestionField as="input" value={goal} onChange={setGoal} className={ta} placeholder={tx("e.g. Build an AI startup")} chipLabel={T("目标备选", "Goal options")} suggestions={[T("打造一个可收费 AI SaaS", "Build a paid AI SaaS"), T("验证一个新业务场景", "Validate a new business scenario"), T("建立企业内部 AI 工作台", "Build an internal AI workspace")]} />
        <RunButton busy={busy} runKey="lat" onClick={() => run("lat", "/api/phronesis/latticework", { goal })} label="Build Latticework" />
      </StudioSection>

      <StudioSection title="2 · Decision Lens" hint="A decision — analyzed through 8 lenses with a confidence score">
        <SuggestionField as="input" value={decision} onChange={setDecision} className={ta} placeholder={tx("e.g. Should I start a company?")} chipLabel={T("决策备选", "Decision options")} suggestions={[T("是否先做收费验证", "Whether to validate payment first"), T("是否减少导航入口", "Whether to reduce navigation paths"), T("是否把模板作为首屏主叙事", "Whether templates should be the primary first-screen narrative")]} />
        <RunButton busy={busy} runKey="lens" onClick={() => run("lens", "/api/phronesis/lens", { decision }, (j) => `Confidence: ${Math.round(((j.result as { confidence: number })?.confidence ?? 0) * 100)}`)} label="Run Lenses" />
      </StudioSection>

      <StudioSection title="3 · Bias Detector" hint="Paste a piece of reasoning — get likely biases + corrections">
        <SuggestionField value={reasoning} onChange={setReasoning} rows={3} className={ta} chipLabel={T("推理备选", "Reasoning options")} suggestions={[T("用户说喜欢这个方向，所以我们应该继续开发更多功能。", "Users said they like the direction, so we should build more features."), T("竞品都有这个模块，所以我们也必须做。", "Competitors have this module, so we must build it too."), T("我已经投入很多时间，所以不能现在收缩范围。", "I have invested a lot of time, so I cannot narrow scope now.")]} />
        <RunButton busy={busy} runKey="bias" onClick={() => run("bias", "/api/phronesis/bias/analyze", { reasoning }, (j) => `Bias risk: ${Math.round(((j.riskScore as number) ?? 0) * 100)}`)} label="Detect Biases" />
      </StudioSection>

      <StudioSection title="4 · Judgment & Meta-Thinking" hint="Reflections on how you decide — one per line">
        <SuggestionField value={reflections} onChange={setReflections} rows={3} className={ta} chipLabel={T("复盘备选", "Reflection options")} suggestions={[T("我倾向于用功能数量证明进展，而不是用用户证据证明价值。", "I tend to prove progress with feature count instead of user evidence."), T("当选择太多时，我会推迟行动。", "When there are too many options, I delay action."), T("我需要把判断写成可复盘的假设。", "I need to write judgments as reviewable assumptions.")]} />
        <div className="flex gap-2">
          <RunButton busy={busy} runKey="judg" onClick={() => run("judg", "/api/phronesis/judgment", { reflections: lines(reflections) })} label="Score Judgment" />
          <RunButton busy={busy} runKey="meta" onClick={() => run("meta", "/api/phronesis/meta", { reflections: lines(reflections) })} label="Cognitive Profile" />
        </div>
      </StudioSection>

      <StudioSection title="5 · Decision Journal" hint="A decision to journal (assumptions + expected outcome get structured)">
        <SuggestionField as="input" value={journal} onChange={setJournal} className={ta} placeholder={tx("e.g. Hire a senior engineer now")} chipLabel={T("日志备选", "Journal options")} suggestions={[T("本周是否上线收费版", "Whether to launch paid version this week"), T("是否暂停一个低转化模块", "Whether to pause a low-conversion module"), T("是否把项目工作台作为核心卖点", "Whether Project Workbench should be the core selling point")]} />
        <RunButton busy={busy} runKey="jrnl" onClick={() => run("jrnl", "/api/phronesis/decision-journal", { decision: journal })} label="Journal Decision" />
      </StudioSection>

      <StudioSection title="6 · Uncertainty" hint="A situation under uncertainty — get options + tail risks">
        <SuggestionField as="input" value={situation} onChange={setSituation} className={ta} placeholder={tx("e.g. Launching into a new market")} chipLabel={T("不确定场景", "Uncertainty options")} suggestions={[T("进入一个没有现成客户渠道的新行业", "Entering a new industry without existing customer channels"), T("产品还未稳定但已有客户催促上线", "Customers want launch before the product is stable"), T("团队资源只能支持一个核心方向", "Team resources can support only one core direction")]} />
        <RunButton busy={busy} runKey="unc" onClick={() => run("unc", "/api/phronesis/uncertainty", { situation })} label="Assess Uncertainty" />
      </StudioSection>

      <StudioSection title="7 · Strategic Diagnosis" hint="A problem — get root causes + leverage points">
        <SuggestionField as="input" value={problem} onChange={setProblem} className={ta} placeholder={tx("e.g. Growth has stalled")} chipLabel={T("问题备选", "Problem options")} suggestions={[T("新用户看了很多页面但没有创建工作区", "New users view many pages but do not create a workspace"), T("功能很多但付费理由不清楚", "Many features but unclear reason to pay"), T("模板丰富但用户不知道先选哪个", "Templates are rich but users do not know where to start")]} />
        <RunButton busy={busy} runKey="diag" onClick={() => run("diag", "/api/phronesis/diagnosis", { problem })} label="Diagnose" />
      </StudioSection>

      <StudioSection title="8 · Wisdom" hint="Lessons learned — one per line — distilled into insights + principles">
        <SuggestionField value={lessons} onChange={setLessons} rows={3} className={ta} chipLabel={T("教训备选", "Lesson options")} suggestions={[T("先让用户完成一个真实结果，再展示完整能力库。", "Help users complete one real outcome before showing the full capability library."), T("模板不是内容库，而是降低启动成本的工作区。", "Templates are not a content library; they are workspaces that lower activation cost."), T("分数只能做证据，不能替代真实进展叙事。", "Scores can be evidence, but cannot replace real progress narrative.")]} />
        <RunButton busy={busy} runKey="wis" onClick={() => run("wis", "/api/phronesis/wisdom", { lessons: lines(lessons) })} label="Distill Wisdom" />
      </StudioSection>
    </div>
  );
}
