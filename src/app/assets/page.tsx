"use client";

import { useState } from "react";
import { Card, PageHeader, ScoreBar } from "@/components/ui";
import { useApi, useApiMutation } from "@/lib/hooks";
import { useI18n, useT } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { ASSET_STAGES, ASSET_TYPES, type AssetStage } from "@/lib/asset-growth-math";

interface Asset { id: string; name: string; type: string; stage: AssetStage; progress: number }
interface Plan { objective: string; milestones: string[]; deepWorkBlocks: number; firstStep: string }

export default function AssetsPage() {
  const { locale } = useI18n();
  const T = useT();
  const list = useApi<{ assets: Asset[]; portfolio: number; published: number }>("/api/assets/growth");
  const [name, setName] = useState("");
  const [type, setType] = useState<string>(ASSET_TYPES[0]);
  const create = useApiMutation<{ action: string; name: string; type: string }, unknown>("/api/assets/growth", { invalidate: ["/api/assets/growth"] });
  const advance = useApiMutation<{ action: string; assetId: string; stage: string }, unknown>("/api/assets/growth", { invalidate: ["/api/assets/growth"] });
  const plan = useApiMutation<{ action: string; name: string; type: string }, { plan: Plan }>("/api/assets/growth");
  const [planFor, setPlanFor] = useState<string | null>(null);
  const d = list.data;

  return (
    <div>
      <PageHeader title={T("资产成长", "Asset-Based Growth")} subtitle={T("用可复利的持久产出衡量成长,而非活动量。", "Measure growth by durable, compounding outputs — not activity.")} />
      <Card title={T("组合", "Portfolio")}>
        <div className="flex flex-wrap items-end gap-8">
          <div><div className="text-xs text-slate-500">{T("组合分", "Portfolio score")}</div><div className="text-3xl font-bold tabular-nums">{Math.round(d?.portfolio ?? 0)}</div></div>
          <div><div className="text-xs text-slate-500">{T("已发布资产", "Published assets")}</div><div className="text-3xl font-bold tabular-nums text-emerald-300">{d?.published ?? 0}</div></div>
        </div>
      </Card>

      <div className="mt-4">
        <Card title={T("新建资产", "New asset")}>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={T("资产名称", "asset name")} className="flex-1 rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200">
              {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => name.trim() && create.mutate({ action: "create", name, type })} disabled={create.isPending || !name.trim()}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 disabled:opacity-50">{T("创建", "Create")}</button>
          </div>
          {create.error && isUpgradeError(create.error) && <div className="mt-3"><UpgradeNotice feature={T("资产成长", "Asset-Based Growth")} tier="Plus" /></div>}
        </Card>
      </div>

      <div className="mt-4 space-y-3">
        {(d?.assets ?? []).map((a) => (
          <Card key={a.id} title={`${a.name} · ${a.type}`}>
            <ScoreBar label={`${a.stage} · ${a.progress}%`} value={a.progress / 100} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <select value={a.stage} onChange={(e) => advance.mutate({ action: "advance", assetId: a.id, stage: e.target.value })}
                className="rounded-lg border border-slate-700 bg-slate-950/50 p-1.5 text-slate-200">
                {ASSET_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => { setPlanFor(a.id); plan.mutate({ action: "plan", name: a.name, type: a.type }); }} disabled={plan.isPending}
                className="rounded-lg bg-slate-700 px-3 py-1.5 font-medium hover:bg-slate-600 disabled:opacity-50">{T("生成构建计划", "Build plan")}</button>
            </div>
            {planFor === a.id && plan.data?.plan && (
              <div className="mt-2 rounded-lg border border-slate-800 p-2">
                <p className="text-sm text-slate-200">{plan.data.plan.objective}</p>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-400">{plan.data.plan.milestones.map((m, i) => <li key={i}>· {m}</li>)}</ul>
                <p className="mt-1 text-xs text-emerald-300">{T("第一步", "First step")}: {plan.data.plan.firstStep} · {plan.data.plan.deepWorkBlocks} {T("个深度工作块", "deep-work blocks")}</p>
              </div>
            )}
          </Card>
        ))}
        {d && d.assets.length === 0 && <p className="text-sm text-slate-500">{T("还没有资产,创建第一个吧。", "No assets yet — create your first.")}</p>}
      </div>
    </div>
  );
}
