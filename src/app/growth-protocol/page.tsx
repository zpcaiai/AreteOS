"use client";

import { useState } from "react";
import { Card, Empty, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { PROTOCOL_STAGES, type ProtocolStage } from "@/lib/protocol-scoring";

interface Run { id: string; title: string; contextType: string; progress: number; score: number; nextStage: ProtocolStage | null; stages: Partial<Record<ProtocolStage, { score: number; notes: string }>> }
interface DiagnoseResp { run: Run; diagnosis: { diagnosis: { primaryBottleneck: string; recommendation: string; recommendedNextEngine: string } } }
interface DesignResp { run: Run; prescription: { prescription: { title: string; firstAction: string } } | null }
interface FullLoopResp { run: Run | null; diagnosis: { primaryBottleneck: string }; prescription: { title: string; firstAction: string } | null; plan: { practice: string; compound: string; decisionRule: string } }

const STAGE_LABEL: Record<ProtocolStage, { zh: string; en: string }> = {
  observe: { zh: "观察", en: "Observe" }, diagnose: { zh: "诊断", en: "Diagnose" }, design: { zh: "设计", en: "Design" },
  practice: { zh: "练习", en: "Practice" }, reflect: { zh: "反思", en: "Reflect" }, update: { zh: "更新", en: "Update" }, compound: { zh: "复利", en: "Compound" },
};

export default function GrowthProtocolPage() {
  const { locale } = useI18n();
  const T = useT();
  const SL = (s: ProtocolStage) => (locale === "en" ? STAGE_LABEL[s].en : STAGE_LABEL[s].zh);
  const runs = useApi<{ runs: Run[] }>("/api/growth-protocol");
  const [title, setTitle] = useState("");
  const create = useApiMutation<{ title: string }, { id: string }>("/api/growth-protocol", { invalidate: ["/api/growth-protocol"] });
  const [selected, setSelected] = useState<string | null>(null);
  const detailUrl = selected ? `/api/growth-protocol/${selected}` : null;
  const detail = useApi<{ run: Run }>(detailUrl);
  const inval = { invalidate: [detailUrl ?? "/api/growth-protocol", "/api/growth-protocol"] };
  const postUrl = `/api/growth-protocol/${selected ?? "none"}`;
  const record = useApiMutation<{ action: string; stage: ProtocolStage; score: number; notes: string }, { run: Run }>(postUrl, inval);
  const diagnose = useApiMutation<{ action: string; problemStatement: string }, DiagnoseResp>(postUrl, inval);
  const design = useApiMutation<{ action: string }, DesignResp>(postUrl, inval);
  const fullLoop = useApiMutation<{ action: string; problemStatement: string }, FullLoopResp>(postUrl, inval);
  const run = detail.data?.run;
  const [problem, setProblem] = useState("");
  const [stageScore, setStageScore] = useState<Record<string, number>>({});

  return (
    <div>
      <PageHeader title={T("成长协议", "Growth Protocol")} subtitle={T("统一循环;诊断/设计阶段直接驱动瓶颈诊断与成长处方引擎。", "The unified loop; the diagnose/design stages drive the Bottleneck and Prescription engines.")} />
      <Card title={T("开启一次协议运行", "Start a protocol run")}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={T("主题", "Title")} className="flex-1 rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
          <button onClick={() => title.trim() && create.mutate({ title })} disabled={create.isPending || title.trim().length < 2} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{T("创建", "Create")}</button>
        </div>
        {create.error && isUpgradeError(create.error) && <div className="mt-3"><UpgradeNotice feature={T("成长协议", "Growth Protocol")} tier="Plus" /></div>}
      </Card>

      <div className="mt-4">
        <Card title={T("我的运行", "My runs")}>
          {runs.data?.runs.length ? (
            <ul className="space-y-2">{runs.data.runs.map((r) => (
              <li key={r.id}><button onClick={() => setSelected(r.id)} className={`w-full rounded-lg border p-2 text-left text-sm ${selected === r.id ? "border-indigo-500 bg-indigo-950/30" : "border-slate-800 hover:border-slate-700"}`}>
                <div className="flex justify-between"><span className="font-medium text-slate-200">{r.title}</span><span className="tabular-nums text-slate-400">{Math.round(r.score)} · {r.progress}%</span></div>
              </button></li>
            ))}</ul>
          ) : <Empty>{T("还没有运行。", "No runs yet.")}</Empty>}
        </Card>
      </div>

      {run && (
        <div className="mt-4 space-y-3">
          <Card title={`${run.title} — ${T("协议得分", "Protocol score")} ${Math.round(run.score)} / 100`}>
            <p className="text-xs text-slate-500">{T("进度", "Progress")}: {run.progress}% · {T("下一阶段", "Next")}: {run.nextStage ? SL(run.nextStage) : T("已完成", "complete")}</p>
          </Card>

          <Card title={T("端到端编排", "End-to-end orchestration")} accent="#a78bfa">
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={2} placeholder={T("描述当前问题(用于自动诊断)…", "Describe the problem (for auto-diagnose)…")} className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-sm text-slate-200" />
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button onClick={() => diagnose.mutate({ action: "diagnose", problemStatement: problem })} disabled={diagnose.isPending} className="rounded-lg bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-500 disabled:opacity-50">{diagnose.isPending ? "…" : T("自动诊断(瓶颈引擎)", "Auto-diagnose (Bottleneck)")}</button>
              <button onClick={() => design.mutate({ action: "design" })} disabled={design.isPending} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-500 disabled:opacity-50">{design.isPending ? "…" : T("自动设计(处方引擎)", "Auto-design (Prescription)")}</button>
              <button onClick={() => fullLoop.mutate({ action: "full-loop", problemStatement: problem })} disabled={fullLoop.isPending} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">{fullLoop.isPending ? T("贯穿中…", "Running…") : T("⚡ 一键贯穿全引擎", "⚡ Run full loop")}</button>
            </div>
            {diagnose.data && <p className="mt-2 text-sm text-amber-300/90">{T("诊断", "Diagnosis")}: {diagnose.data.diagnosis.diagnosis.primaryBottleneck} — {diagnose.data.diagnosis.diagnosis.recommendation}</p>}
            {design.data?.prescription && <p className="mt-1 text-sm text-emerald-300">{T("处方", "Prescription")}: {design.data.prescription.prescription.title} · {design.data.prescription.prescription.firstAction}</p>}
            {fullLoop.data && (
              <div className="mt-2 rounded-lg border border-indigo-800/50 bg-indigo-950/20 p-2 text-xs text-slate-300">
                <div className="mb-1 font-semibold text-indigo-300">{T("全引擎贯穿结果", "Full-loop result")} · {T("协议得分", "score")} {Math.round(fullLoop.data.run?.score ?? 0)}</div>
                <p>· {T("诊断", "Diagnose")} → {fullLoop.data.diagnosis.primaryBottleneck}</p>
                {fullLoop.data.prescription && <p>· {T("设计", "Design")} → {fullLoop.data.prescription.title}</p>}
                <p>· {T("练习(计划)", "Practice (plan)")} → {fullLoop.data.plan.practice}</p>
                <p>· {T("更新", "Update")} → {fullLoop.data.plan.decisionRule}</p>
                <p>· {T("复利(计划)", "Compound (plan)")} → {fullLoop.data.plan.compound}</p>
              </div>
            )}
          </Card>

          {PROTOCOL_STAGES.map((s) => {
            const done = run.stages[s];
            return (
              <Card key={s} title={SL(s)}>
                {done && <div className="mb-2"><ScoreBar label={done.notes || T("已记录", "recorded")} value={done.score} /></div>}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <input type="range" min={0} max={100} value={Math.round((stageScore[s] ?? done?.score ?? 0.5) * 100)} onChange={(e) => setStageScore((v) => ({ ...v, [s]: Number(e.target.value) / 100 }))} className="flex-1 accent-indigo-500" />
                  <span className="w-10 text-right tabular-nums text-slate-300">{Math.round((stageScore[s] ?? done?.score ?? 0.5) * 100)}%</span>
                  <button onClick={() => record.mutate({ action: "record", stage: s, score: stageScore[s] ?? done?.score ?? 0.5, notes: "" })} disabled={record.isPending} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{T("记录", "Record")}</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
