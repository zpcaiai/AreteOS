"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import ShareCardModal from "@/components/ShareCardModal";
import { SuggestionField } from "@/components/SuggestionField";

interface OSResp { result: { template: string; version: number; os: { mission: string; identityStack: { primary: string; secondary: string; emerging: string; legacy: string } } } }
interface RunResp { id: string }
interface LoopResp { run: { score: number } | null; diagnosis: { primaryBottleneck: string }; prescription: { title: string; firstAction: string } | null; plan: { practice: string; compound: string; decisionRule: string } }

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

type Phase = "idle" | "running" | "done" | "upgrade" | "error";

export default function OnboardingPage() {
  const { locale } = useI18n();
  const T = useT();
  const [intent, setIntent] = useState("");
  const [problem, setProblem] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [os, setOs] = useState<OSResp["result"] | null>(null);
  const [loop, setLoop] = useState<LoopResp | null>(null);
  const [showCard, setShowCard] = useState(false);

  const STEPS = [T("编译你的人生 OS", "Compiling your life OS"), T("启动一次成长协议", "Starting a growth protocol"), T("贯穿全引擎", "Running the full loop")];

  async function run() {
    setPhase("running"); setStep(0); setErrMsg("");
    try {
      const osResp = await postJson<OSResp>("/api/personal-os", { intent });
      setOs(osResp.result); setStep(1);
      const runResp = await postJson<RunResp>("/api/growth-protocol", { title: (intent.slice(0, 80) || "First loop") });
      setStep(2);
      const loopResp = await postJson<LoopResp>(`/api/growth-protocol/${runResp.id}`, { action: "full-loop", problemStatement: problem });
      setLoop(loopResp); setPhase("done");
    } catch (e) {
      if (isUpgradeError(e)) setPhase("upgrade");
      else { setErrMsg(e instanceof Error ? e.message : String(e)); setPhase("error"); }
    }
  }

  return (
    <div>
      <PageHeader title={T("首跑:走一遍成长闭环", "First run: walk the whole loop")} subtitle={T("用一次贯穿,把「想成为谁」变成可执行的人生 OS + 一次完整的成长循环。", "In one pass, turn 'who you want to become' into an executable life OS + a full growth loop.")} />

      {(phase === "idle" || phase === "error" || phase === "upgrade") && (
        <Card title={T("两个问题", "Two questions")}>
          <SuggestionField
            label={T("1. 你想成为谁?", "1. Who do you want to become?")}
            value={intent}
            onChange={setIntent}
            rows={2}
            placeholder={T("例如:一名 AI 研究型创业者。", "e.g. an AI research entrepreneur.")}
            chipLabel={T("可直接采用", "Ready options")}
            suggestions={[
              T("一名能持续发布产品的 AI 创业者", "An AI founder who consistently ships products"),
              T("一名把专业知识变成复利资产的研究者", "A researcher turning expertise into compounding assets"),
              T("一名更稳定、更有判断力的团队负责人", "A steadier team lead with better judgment"),
            ]}
          />
          <div className="mt-3">
            <SuggestionField
              label={T("2. 现在最卡你的是什么?", "2. What's most blocking you right now?")}
              value={problem}
              onChange={setProblem}
              rows={2}
              placeholder={T("例如:我读了很多却从不产出。", "e.g. I read a lot but never publish.")}
              chipLabel={T("常见卡点", "Common blockers")}
              suggestions={[
                T("输入很多，但迟迟没有发布一个可验证成果。", "I consume a lot but rarely publish a verifiable output."),
                T("目标太多，今天不知道该先做哪一个动作。", "Too many goals; I do not know the next action for today."),
                T("知道应该行动，但缺少稳定节奏和反馈证据。", "I know what to do but lack rhythm and feedback evidence."),
              ]}
            />
          </div>
          <button onClick={run} disabled={intent.trim().length < 5} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">{T("⚡ 开始我的首跑", "⚡ Run my first loop")}</button>
          {phase === "error" && <p className="mt-2 text-sm text-rose-400" role="alert">{errMsg}</p>}
        </Card>
      )}

      {phase === "upgrade" && <div className="mt-4"><UpgradeNotice feature={T("首跑闭环(驱动全引擎)", "First-run loop (drives all engines)")} /></div>}

      {phase === "running" && (
        <Card title={T("正在为你跑通闭环…", "Running your loop…")}>
          <ul className="space-y-2 text-sm">
            {STEPS.map((s, i) => (
              <li key={i} className={`flex items-center gap-2 ${i < step ? "text-emerald-400" : i === step ? "text-slate-100" : "text-slate-500"}`}>
                <span>{i < step ? "✓" : i === step ? "•" : "○"}</span> {s}{i === step ? "…" : ""}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {phase === "done" && os && loop && (
        <div className="space-y-4">
          <Card title={T("🎉 你的人生 OS 已编译", "🎉 Your life OS is compiled")} accent="#34d399">
            <p className="text-sm text-slate-200">{os.os.mission}</p>
            <p className="mt-2 text-xs text-slate-400">{T("身份栈", "Identity stack")}: {os.os.identityStack.primary} → {os.os.identityStack.secondary} → {os.os.identityStack.emerging} → {os.os.identityStack.legacy}</p>
          </Card>
          <Card title={`${T("你的起始计划(全引擎生成)", "Your starting plan")} · ${T("协议得分", "score")} ${Math.round(loop.run?.score ?? 0)}`} accent="#a78bfa">
            <ul className="space-y-1 text-sm text-slate-300">
              <li>· {T("诊断", "Diagnose")} → <span className="text-amber-300">{loop.diagnosis.primaryBottleneck}</span></li>
              {loop.prescription && <li>· {T("设计", "Design")} → <span className="text-emerald-300">{loop.prescription.title}</span></li>}
              <li>· {T("练习", "Practice")} → {loop.plan.practice}</li>
              <li>· {T("更新", "Update")} → {loop.plan.decisionRule}</li>
              <li>· {T("复利", "Compound")} → {loop.plan.compound}</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">{T("这些是为你生成的起始计划——去对应引擎真正完成,数据才会计入(本页不会写入任何成绩)。", "This is your starting plan — complete each step in its engine for real to log progress (nothing here is written as activity).")}</p>
          </Card>
          <Card title={T("继续探索", "Keep going")}>
            <div className="mb-3">
              <button onClick={() => setShowCard(true)} className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-amber-400">{T("🪪 生成可分享的成长卡片", "🪪 Create a shareable growth card")}</button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="/journey" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500">{T("打开成长全景 →", "Open mission control →")}</a>
              {[["/personal-os", T("人生 OS", "Life OS")], ["/growth-protocol", T("成长协议", "Protocol")], ["/bottlenecks", T("瓶颈", "Bottleneck")], ["/prescriptions", T("处方", "Prescription")], ["/deep-work", T("深度工作", "Deep Work")], ["/assets", T("资产", "Assets")], ["/life-capital", T("人生资本", "Life Capital")], ["/identity-tree", T("身份树", "Identity Tree")]].map(([href, label]) => (
                <a key={href} href={href} className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:border-slate-500">{label}</a>
              ))}
            </div>
          </Card>
        </div>
      )}

      {showCard && os && loop && (
        <ShareCardModal
          title={T("我的成长 OS", "My Growth OS")}
          content={`${os.os.mission}\n\n${T("诊断", "Diagnose")}: ${loop.diagnosis.primaryBottleneck} · ${T("协议分", "score")} ${Math.round(loop.run?.score ?? 0)}`}
          source={`${os.os.identityStack.primary} -> ${os.os.identityStack.legacy}`}
          onClose={() => setShowCard(false)}
        />
      )}
    </div>
  );
}
