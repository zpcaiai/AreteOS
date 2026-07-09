"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputCls, lines } from "@/components/studio";
import { useT, useTx } from "@/lib/i18n/client";
import { SuggestionField } from "@/components/SuggestionField";

const ta = inputCls;

export function AssessmentTool() {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [reflections, setReflections] = useState("");
  const [mission, setMission] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ summary: string; globalScore: number } | null>(null);

  async function run() {
    setBusy(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/ethos/assess", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ reflections: lines(reflections), mission }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setResult({ summary: json.assessment.summary, globalScore: json.assessment.globalScore });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("身份评估", "Identity Assessment")}</h2>
      <p className="mt-1 text-sm text-slate-400">{T("回顾你实际把注意力花在哪、如何做决定——每行一条想法。", "Reflect on how you actually spend attention and make decisions — one thought per line.")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      <SuggestionField as="input" value={mission} onChange={setMission} placeholder={tx("Your mission (optional)")} className={`mt-3 ${ta}`} chipLabel={T("使命备选", "Mission options")} suggestions={[T("把想法变成真实成果。", "Turn ideas into real outcomes."), T("帮助组织用证据做判断。", "Help organizations make judgments with evidence."), T("把专业能力沉淀为可复用资产。", "Turn expertise into reusable assets.")]} />
      <div className="mt-2">
        <SuggestionField value={reflections} onChange={setReflections} rows={5} placeholder={tx("Reflections, one per line…")} className={ta} chipLabel={T("反思备选", "Reflection options")} suggestions={[T("我实际把时间花在响应别人，而不是推进核心协议。", "I spend time reacting to others instead of advancing the core protocol."), T("我在困难任务前会转去做低风险优化。", "Before difficult tasks I switch to low-risk optimization."), T("我最想成为的人，会先留下证据再解释自己。", "The person I want to become leaves evidence before explaining.")]} />
      </div>
      <button onClick={run} disabled={busy} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy ? tx("Assessing…") : tx("Assess my identity")}</button>
      {result && (
        <div className="mt-3 rounded-lg border border-indigo-800 bg-indigo-950/30 p-3 text-sm">
          <div className="text-2xl font-bold tabular-nums">{Math.round(result.globalScore * 100)}<span className="text-sm text-slate-500"> / 100</span></div>
          <p className="mt-1 text-slate-300">{result.summary}</p>
        </div>
      )}
    </div>
  );
}

export function StackTool() {
  const tx = useTx();
  const T = useT();
  const router = useRouter();
  const [mission, setMission] = useState("");
  const [values, setValues] = useState("");
  const [strengths, setStrengths] = useState("");
  const [current, setCurrent] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function call(key: string, endpoint: string, body: unknown) {
    setBusy(key); setError("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-bold">{T("构建你的身份栈", "Build Your Identity Stack")}</h2>
      <p className="mt-1 text-sm text-slate-400">{T("组合主要、次要、新兴与传承身份——再检测冲突并给出建议。", "Compose a primary, secondary, emerging and legacy identity — then detect conflicts and get recommendations.")}</p>
      {error && <p className="mt-2 rounded bg-rose-950/50 px-3 py-1 text-sm text-rose-300">{error}</p>}
      <SuggestionField as="input" value={mission} onChange={setMission} placeholder={T("使命", "Mission")} className={`mt-3 ${ta}`} chipLabel={T("使命备选", "Mission options")} suggestions={[T("持续交付真实客户结果", "Continuously deliver real customer outcomes"), T("用 AI 放大人的判断力", "Use AI to amplify human judgment"), T("把复杂工作变成可复制系统", "Turn complex work into repeatable systems")]} />
      <label className="mt-2 block text-xs text-slate-400">{T("价值观(每行一项)", "Values (one per line)")}</label>
      <SuggestionField value={values} onChange={setValues} rows={2} className={ta} chipLabel={T("价值观备选", "Value options")} suggestions={[T("真实结果", "Real outcomes"), T("长期信任", "Long-term trust"), T("证据复盘", "Evidence-based review")]} />
      <label className="mt-2 block text-xs text-slate-400">{T("优势(每行一项)", "Strengths (one per line)")}</label>
      <SuggestionField value={strengths} onChange={setStrengths} rows={2} className={ta} chipLabel={T("优势备选", "Strength options")} suggestions={[T("系统思维", "Systems thinking"), T("产品判断", "Product judgment"), T("客户洞察", "Customer insight")]} />
      <label className="mt-2 block text-xs text-slate-400">{T("当前身份(每行一项,可选)", "Current identities (one per line, optional)")}</label>
      <SuggestionField value={current} onChange={setCurrent} rows={2} className={ta} chipLabel={T("身份备选", "Identity options")} suggestions={[T("产品构建者", "Product builder"), T("AI 创业者", "AI founder"), T("组织系统设计者", "Organizational system designer")]} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button disabled={busy !== null} onClick={() => call("stack", "/api/ethos/stack", { mission, values: lines(values), strengths: lines(strengths), current: lines(current) })}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium disabled:opacity-50">{busy === "stack" ? tx("Building…") : tx("Build stack")}</button>
        <button disabled={busy !== null} onClick={() => call("rec", "/api/ethos/recommend", { mission, values: lines(values), strengths: lines(strengths) })}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-50">{busy === "rec" ? "…" : tx("Recommend identities")}</button>
        <button disabled={busy !== null} onClick={() => call("conf", "/api/ethos/conflicts", { identities: lines(current) })}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 disabled:opacity-50">{busy === "conf" ? "…" : tx("Detect conflicts")}</button>
      </div>
      <p className="mt-3 text-xs text-slate-500">{T("结果会显示在", "Results appear in the")} <Link href="/ethos/evolution" className="text-indigo-400">{T("进化", "Evolution")}</Link> {T("视图中。", "view.")}</p>
    </div>
  );
}
