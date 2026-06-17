"use client";
import { useEffect, useState } from "react";
import type { EngineConfig } from "./config";
import { PORTFOLIO_AREAS } from "./config";
import { useT } from "@/lib/i18n/client";

/* Generic interactive panel for one Naval engine: renders the input fields from
   config, POSTs to the assess endpoint, and pretty-prints the JSON result. Also
   loads the latest persisted record from the profile endpoint on mount. */

const title = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();

// Naval engine config is plain English data; translate its visible strings for zh.
const NAVAL_ZH: Record<string, string> = {"Assess": "评估", "Build stack": "构建技能栈", "Assess leverage": "评估杠杆", "Assess judgment": "评估判断力", "Log decision": "记录决策", "Map wealth": "梳理财富", "Generate ideas": "生成创意", "Discover": "发现机会", "Assess game": "评估这场游戏", "Assess freedom": "评估自由度", "Check in": "签到", "Assess balance": "评估平衡", "Simulate": "模拟", "Answer the prompts (one per line)": "回答这些提示(每行一条)", "Any extra context": "其他补充背景", "Your skills (one per line)": "你的技能(每行一项)", "Interests / obsessions (optional)": "兴趣 / 痴迷之事(可选)", "Describe your current work": "描述你目前的工作", "Income sources (one per line)": "收入来源(每行一项)", "Recent meaningful decisions (one per line)": "近期重要决策(每行一条)", "Reflections on how you decide (optional)": "关于你如何决策的反思(可选)", "The decision": "这个决策", "Context (optional)": "背景(可选)", "Income streams (one per line)": "收入流(每行一项)", "Assets you own (one per line)": "你拥有的资产(每行一项)", "What do you know how to do?": "你会做什么?", "Audience (optional)": "受众(可选)", "Skills (one per line)": "技能(每行一项)", "Interests (one per line)": "兴趣(每行一项)", "The game / path": "这场游戏 / 路径", "Your current situation": "你目前的处境", "Known constraints (one per line)": "已知约束(每行一项)", "How are you, honestly?": "说实话,你最近怎么样?", "Current desires (one per line)": "当前的欲望(每行一项)", "Rate each life area": "为每个人生领域打分", "Signals about your situation (one per line)": "关于你处境的信号(每行一条)", "Your goal": "你的目标", "What do you learn without being forced?\nWhat do people ask you for help with?\nWhat is obvious to you but not to others?": "你不被强迫也会去学的是什么?\n别人常找你帮忙的是什么?\n对你显而易见、别人却未必懂的是什么?", "Background, current work, domain…": "背景、当前工作、领域……", "AI engineering\nteaching\nsystems design\nwriting": "AI 工程\n教学\n系统设计\n写作", "education\ndeveloper tools": "教育\n开发者工具", "Salaried consultant billing hours…": "按小时计费的受薪顾问……", "salary\nfreelance gigs": "工资\n自由职业接活", "I act fast and rarely write down assumptions": "我行动很快,很少写下假设", "I tend to anchor on the first option": "我容易锚定在第一个选项上", "Leave my job to build a product": "辞职去做一个产品", "6 months runway, idea has early pull…": "6 个月现金跑道,点子已有早期吸引力……", "salary\nside project": "工资\n副业项目", "open-source library\nnewsletter": "开源库\n邮件通讯", "I know how to migrate legacy apps to Next.js": "我知道如何把老应用迁移到 Next.js", "indie developers": "独立开发者", "Next.js\nAI agents": "Next.js\nAI 智能体", "developer productivity": "开发者效率", "Grow an audience by chasing viral hot-takes": "靠追逐爆款热点来涨粉", "Why you're considering it…": "你为什么在考虑它……", "Office job, fixed hours, one income source": "坐班工作、固定工时、单一收入来源", "mortgage\nfixed 9-6\nsingle income": "房贷\n固定 9-6 坐班\n单一收入", "Restless, comparing myself to peers constantly": "焦躁不安,总拿自己和同辈比较", "more status\na bigger title": "更多地位\n更大的头衔", "What's been getting all your attention…": "最近是什么占据了你全部的注意力……", "High specific knowledge\nLow leverage\nNo owned assets": "专属知识强\n杠杆低\n没有自有资产", "Financial freedom in 5 years": "5 年内实现财务自由"};
const AREA_ZH: Record<string, string> = {"HEALTH": "健康", "WEALTH": "财富", "LEARNING": "学习", "RELATIONSHIPS": "关系", "MISSION": "使命", "FREEDOM": "自由", "HAPPINESS": "幸福", "CREATIVITY": "创造力", "LEGACY": "传承"};


function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const hue = Math.round(pct * 1.2);
  return (
    <div className="mb-1.5">
      <div className="mb-0.5 flex justify-between text-xs text-slate-400"><span>{label}</span><span className="tabular-nums">{pct}</span></div>
      <div className="h-2 w-full rounded-full bg-slate-800"><div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: `hsl(${hue} 70% 50%)` }} /></div>
    </div>
  );
}

function Value({ k, v }: { k: string; v: unknown }) {
  const T = useT();
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    if (/score/i.test(k) && v > 1) return <div><span className="text-2xl font-bold tabular-nums">{Math.round(v)}</span><span className="ml-1 text-xs text-slate-500">/100</span></div>;
    if (v >= 0 && v <= 1) return <ScoreBar label={title(k)} value={v} />;
    return <div className="text-sm tabular-nums">{v}</div>;
  }
  if (typeof v === "string") return <p className="text-sm text-slate-300">{v}</p>;
  if (typeof v === "boolean") return <span className="text-sm">{v ? T("是", "yes") : T("否", "no")}</span>;
  if (Array.isArray(v)) {
    if (!v.length) return null;
    return (
      <ul className="space-y-1 text-sm text-slate-300">
        {v.map((item, i) => (
          <li key={i} className="border-t border-slate-800 pt-1">
            {typeof item === "object" && item ? <Obj o={item as Record<string, unknown>} inline /> : String(item)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof v === "object") return <Obj o={v as Record<string, unknown>} />;
  return null;
}

function Obj({ o, inline }: { o: Record<string, unknown>; inline?: boolean }) {
  const entries = Object.entries(o).filter(([k]) => k !== "id" && k !== "userId" && k !== "createdAt" && k !== "updatedAt" && k !== "metadata" && k !== "profileId");
  return (
    <div className={inline ? "" : "space-y-3"}>
      {entries.map(([k, v]) => {
        const rendered = <Value k={k} v={v} />;
        if (!rendered || (Array.isArray(v) && !v.length)) return null;
        const isScalar = typeof v !== "object" || v == null;
        return (
          <div key={k}>
            {!inline && <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title(k)}</div>}
            {inline && isScalar ? <span className="text-slate-300"><span className="text-slate-500">{title(k)}: </span>{String(v)}</span> : rendered}
          </div>
        );
      })}
    </div>
  );
}

export default function EngineStudio({ config }: { config: EngineConfig }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<Record<string, number>>(Object.fromEntries(PORTFOLIO_AREAS.map((a) => [a, 50])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [existing, setExisting] = useState<Record<string, unknown> | null>(null);
  const T = useT();
  const tr = (x?: string) => (x == null ? x : T(NAVAL_ZH[x] ?? x, x));

  useEffect(() => {
    if (!config.profileEndpoint) return;
    fetch(config.profileEndpoint).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!d) return;
      const rec = d.profile ?? d.stacks?.[0] ?? d.games?.[0] ?? d.entries?.[0] ?? d.plans?.[0] ?? d.opportunities?.[0] ?? d.twin ?? null;
      if (rec) setExisting(rec);
    }).catch(() => {});
  }, [config.profileEndpoint]);

  function buildBody() {
    const body: Record<string, unknown> = {};
    for (const f of config.fields) {
      if (f.kind === "list") body[f.name] = (vals[f.name] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      else if (f.kind === "areas") body[f.name] = PORTFOLIO_AREAS.map((a) => ({ area: a, current: (areas[a] ?? 50) / 100 }));
      else body[f.name] = vals[f.name] ?? "";
    }
    return body;
  }

  async function run() {
    setBusy(true); setError(""); setResult(null);
    try {
      const res = await fetch(config.assessEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildBody()) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || T("请求失败", "Request failed"));
      setResult(data);
      setExisting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold">{T("运行", "Run")}</h2>
        <div className="space-y-3">
          {config.fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs text-slate-400">{tr(f.label)}</label>
              {f.kind === "areas" ? (
                <div className="space-y-2">
                  {PORTFOLIO_AREAS.map((a) => (
                    <div key={a} className="flex items-center gap-3">
                      <span className="w-28 text-xs text-slate-400">{T(AREA_ZH[a] ?? a, title(a))}</span>
                      <input type="range" min={0} max={100} value={areas[a]} onChange={(e) => setAreas((s) => ({ ...s, [a]: Number(e.target.value) }))} className="flex-1 accent-indigo-500" />
                      <span className="w-8 text-right text-xs tabular-nums text-slate-300">{areas[a]}</span>
                    </div>
                  ))}
                </div>
              ) : f.kind === "text" ? (
                <input value={vals[f.name] ?? ""} onChange={(e) => setVals((s) => ({ ...s, [f.name]: e.target.value }))} placeholder={tr(f.placeholder)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
              ) : (
                <textarea value={vals[f.name] ?? ""} onChange={(e) => setVals((s) => ({ ...s, [f.name]: e.target.value }))} placeholder={tr(f.placeholder)} rows={f.kind === "list" ? 4 : 3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
              )}
            </div>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
        <button onClick={run} disabled={busy} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {busy ? T("处理中…", "Working…") : tr(config.button)}
        </button>
        <p className="mt-2 text-[11px] text-slate-600">{T("需要 Plus 会员。仅供学习参考——不构成财务、法律或医疗建议。", "Requires a Plus membership. Educational only — not financial, legal, or medical advice.")}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold">{result ? T("结果", "Result") : existing ? T("最近保存", "Latest saved") : T("输出", "Output")}</h2>
        {result ? <Obj o={result} /> : existing ? <Obj o={existing} /> : <p className="text-sm text-slate-500">{T("运行引擎后,结果会显示在这里。", "Run the engine to see your result here.")}</p>}
      </div>
    </div>
  );
}
