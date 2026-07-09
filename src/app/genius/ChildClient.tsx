"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, lines } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

const ta = inputCls;

export function ChildCreateForm() {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);
  const [interests, setInterests] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!name.trim()) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/genius", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, age, interests: lines(interests.replace(/,/g, "\n")) }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setName(""); setInterests("");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="text-sm font-semibold">{T("添加一个孩子", "Add a child")}</h3>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <SuggestionField as="input" value={name} onChange={setName} placeholder={tx("Name")} className={ta} chipLabel={T("名字备选", "Name options")} suggestions={[T("孩子 A", "Child A"), T("小小探索者", "Young explorer"), T("学习伙伴", "Learning partner")]} />
        <input type="number" min={3} max={18} value={age} onChange={(e) => setAge(parseInt(e.target.value) || 0)} placeholder={tx("Age")} className={ta} />
        <SuggestionField as="input" value={interests} onChange={setInterests} placeholder={tx("Interests (comma separated)")} className={ta} chipLabel={T("兴趣备选", "Interest options")} suggestions={[T("恐龙, 太空, 搭积木", "dinosaurs, space, building blocks"), T("画画, 故事, 动物", "drawing, stories, animals"), T("机器人, 实验, 游戏设计", "robots, experiments, game design")]} />
      </div>
      <button onClick={add} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? tx("Adding…") : tx("Add child")}</button>
    </div>
  );
}

export function ChildStudio({ childId, age }: { childId: string; age: number }) {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [out, setOut] = useState("");
  const [obs, setObs] = useState("");
  const [fixed, setFixed] = useState("");
  const [interest, setInterest] = useState("");
  const [idea, setIdea] = useState("");
  const [envDesc, setEnvDesc] = useState("");
  const [problem, setProblem] = useState("");
  const [situation, setSituation] = useState("");
  const [parentCtx, setParentCtx] = useState("");

  async function run(key: string, endpoint: string, body: Record<string, unknown>, summarize?: (j: Record<string, unknown>) => string) {
    setBusy(key); setError(""); setOut("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ childId, ...body }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      if (summarize) setOut(summarize(json));
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(null); }
  }

  const Btn = ({ k, onClick, label }: { k: string; onClick: () => void; label: string }) => (
    <button disabled={busy !== null} onClick={onClick} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy === k ? T("运行中…", "Running…") : label}</button>
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("成长工作室", "Growth Studio")}</h2>
      <p className="mt-1 text-sm text-slate-400">{T("赞助身份、培养好奇心与创造力、设计环境,并辅导家长。从不打分。(离线用 mock AI 运行。)", "Sponsor identity, build curiosity & creativity, design the environment, and coach the parent. Never graded. (Runs offline on mock AI.)")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      {out && <p className="mt-2 rounded bg-indigo-950/40 px-3 py-1 text-sm text-indigo-200">{out}</p>}

      <Box title={T("1 · 身份赞助", "1 · Identity Sponsorship")} hint={T("孩子做什么、喜欢什么——每行一条", "What the child does and loves — one per line")}>
        <SuggestionField value={obs} onChange={setObs} rows={3} className={ta} chipLabel={T("观察备选", "Observation options")} suggestions={[T("遇到新东西会主动拆开看。", "They actively take apart new things to understand them."), T("喜欢把故事画成连续画。", "They like turning stories into comics."), T("遇到难题会先试很多方法。", "They try many methods before giving up.")]} />
        <Btn k="id" onClick={() => run("id", "/api/genius/identity", { observations: lines(obs) }, (j) => `Primary: ${j.primaryIdentity} · Emerging: ${j.emergingIdentity}`)} label={T("赞助身份", "Sponsor Identity")} />
      </Box>

      <Box title={T("2 · 成长型思维", "2 · Growth Mindset")} hint={T("孩子说的固定型思维的话——每行一条", "Fixed-mindset things the child says — one per line")}>
        <SuggestionField value={fixed} onChange={setFixed} rows={2} className={ta} chipLabel={T("表达备选", "Statement options")} suggestions={[T("我就是不会数学。", "I am just bad at math."), T("我画得不好，所以不想画了。", "I draw badly, so I do not want to draw anymore."), T("别人都比我快。", "Everyone else is faster than me.")]} />
        <Btn k="mind" onClick={() => run("mind", "/api/genius/mindset", { statements: lines(fixed) })} label={T("重构为成长型", "Reframe to Growth")} />
      </Box>

      <Box title={T("3 · 好奇心与创造力", "3 · Curiosity & Creativity")} hint={T("一个兴趣,和一个创意点子", "An interest, and a creative idea")}>
        <SuggestionField as="input" value={interest} onChange={setInterest} className={ta} placeholder={tx("Interest (e.g. dinosaurs)")} chipLabel={T("兴趣备选", "Interest options")} suggestions={[T("恐龙", "dinosaurs"), T("太空", "space"), T("机器人", "robots")]} />
        <SuggestionField as="input" value={idea} onChange={setIdea} className={ta} placeholder={tx("Creative idea (e.g. comic about a space cat)")} chipLabel={T("创意备选", "Idea options")} suggestions={[T("做一本太空猫漫画", "Make a comic about a space cat"), T("给恐龙设计一座城市", "Design a city for dinosaurs"), T("做一个家庭天气实验", "Run a home weather experiment")]} />
        <div className="flex gap-2">
          <Btn k="exp" onClick={() => run("exp", "/api/genius/explorer", { interest })} label={T("培养好奇心", "Grow Curiosity")} />
          <Btn k="cre" onClick={() => run("cre", "/api/genius/creativity", { idea })} label={T("创意项目", "Creativity Project")} />
          <Btn k="prj" onClick={() => run("prj", "/api/genius/project", { interest })} label={T("启动一个项目", "Start a Project")} />
        </div>
      </Box>

      <Box title={T("4 · 环境与自主", "4 · Environment & Autonomy")} hint={T("描述学习空间;列出体现自主的行为", "Describe the learning space; list behaviors for autonomy")}>
        <SuggestionField value={envDesc} onChange={setEnvDesc} rows={2} className={ta} placeholder={tx("Environment description")} chipLabel={T("环境备选", "Environment options")} suggestions={[T("有固定创作角，但材料不容易自己取用。", "There is a creation corner, but materials are not easy to access independently."), T("孩子能选择项目，但完成后缺少展示空间。", "The child can choose projects, but lacks a place to display finished work."), T("家长经常直接给答案。", "Parents often give the answer directly.")]} />
        <div className="flex gap-2">
          <Btn k="env" onClick={() => run("env", "/api/genius/environment", { description: envDesc })} label={T("评估环境", "Assess Environment")} />
          <Btn k="aut" onClick={() => run("aut", "/api/genius/autonomy", { observations: lines(envDesc) })} label={T("评估自主", "Assess Autonomy")} />
        </div>
      </Box>

      <Box title={T("5 · 问题解决与韧性", "5 · Problem Solving & Resilience")} hint={T("一个真实问题或一个困难处境", "A real problem or a tough situation")}>
        <SuggestionField as="input" value={problem} onChange={setProblem} className={ta} placeholder={tx("Problem (e.g. my plant keeps dying)")} chipLabel={T("问题备选", "Problem options")} suggestions={[T("植物总是枯萎", "My plant keeps dying"), T("积木桥总是塌", "My block bridge keeps falling"), T("故事不知道怎么结尾", "I do not know how to end the story")]} />
        <SuggestionField as="input" value={situation} onChange={setSituation} className={ta} placeholder={tx("Resilience situation (e.g. gives up when hard)")} chipLabel={T("困难备选", "Challenge options")} suggestions={[T("一失败就说不想做了", "Gives up after one failure"), T("被同伴比较后很沮丧", "Feels discouraged after comparison"), T("遇到复杂任务会发脾气", "Gets upset with complex tasks")]} />
        <div className="flex gap-2">
          <Btn k="ps" onClick={() => run("ps", "/api/genius/problem-solving", { problem })} label={T("问题解决步骤", "Problem-Solving Steps")} />
          <Btn k="res" onClick={() => run("res", "/api/genius/resilience", { situation })} label={T("培养韧性", "Build Resilience")} />
        </div>
      </Box>

      <Box title={T("6 · 家长教练", "6 · Parent Coach")} hint={T("你作为家长正在挣扎的事——每行一条", "What you're struggling with as a parent — one per line")}>
        <SuggestionField value={parentCtx} onChange={setParentCtx} rows={2} className={ta} chipLabel={T("家长困扰备选", "Parent context options")} suggestions={[T("我太容易替孩子解决问题。", "I solve problems for the child too quickly."), T("我不知道怎么鼓励努力而不是只夸结果。", "I do not know how to praise effort instead of only outcomes."), T("我担心孩子坚持不下来。", "I worry the child will not persist.")]} />
        <Btn k="pc" onClick={() => run("pc", "/api/genius/parent-coach", { context: lines(parentCtx) })} label={T("教练我", "Coach Me")} />
      </Box>
    </div>
  );
}

function Box({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  const tx = useTx();
  const T = useT();
  return (
    <details className="mt-3 rounded-lg border border-slate-800 p-3">
      <summary className="cursor-pointer text-sm font-semibold">{title}</summary>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}
