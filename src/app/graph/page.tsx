"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";
import { SuggestionField } from "@/components/SuggestionField";

interface GraphInsights {
  models: number; connections: number; components: number;
  path: { from: string; to: string; hops: number; steps: string[] } | null;
  emergent: { a: string; b: string; sharedModels: string[]; score: number }[];
  central: { name: string; degree: number }[];
}

export default function GraphPage() {
  const { t } = useI18n();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [url, setUrl] = useState("/api/graph/path?limit=8");
  const q = useApi<{ graph: GraphInsights }>(url);
  const g = q.data?.graph;

  function findPath() {
    const params = new URLSearchParams({ limit: "8" });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    setUrl(`/api/graph/path?${params.toString()}`);
  }

  return (
    <div>
      <PageHeader title={t("innov.graph.title")} subtitle={t("innov.graph.subtitle")} />
      <Card title={t("innov.graph.pathCard")}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="min-w-56 flex-1">
            <SuggestionField as="input" value={from} onChange={setFrom} placeholder={t("innov.graph.fromPlaceholder")} className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" chipLabel="起点备选" suggestions={["系统思维", "客户验证", "身份型习惯"]} />
          </div>
          <span className="text-slate-500">→</span>
          <div className="min-w-56 flex-1">
            <SuggestionField as="input" value={to} onChange={setTo} placeholder={t("innov.graph.toPlaceholder")} className="w-full rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" chipLabel="终点备选" suggestions={["可收费 MVP", "深度工作", "证据日志"]} />
          </div>
          <button onClick={findPath} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500">{t("innov.graph.find")}</button>
        </div>
      </Card>

      <div className="mt-4">
        {q.error && isUpgradeError(q.error) ? (
          <UpgradeNotice feature={t("innov.graph.title")} />
        ) : q.isLoading ? (
          <Card title={t("innov.graph.overview")}><p className="text-sm text-slate-500">{t("innov.loading")}</p></Card>
        ) : g ? (
          <div className="space-y-4">
            <Card title={t("innov.graph.overview")}>
              <p className="text-sm text-slate-300">{t("innov.graph.overviewText").replace("{m}", String(g.models)).replace("{c}", String(g.connections)).replace("{k}", String(g.components))}</p>
            </Card>
            {g.path && (
              <Card title={t("innov.graph.pathTitle").replace("{n}", String(g.path.hops))} accent="#34d399">
                <p className="text-sm text-slate-200">{g.path.steps.join("  →  ")}</p>
              </Card>
            )}
            <Card title={t("innov.graph.emergent")}>
              {g.emergent.length ? (
                <ul className="space-y-1 text-sm text-slate-300">
                  {g.emergent.map((e, i) => <li key={i}>· <span className="text-slate-100">{e.a}</span> ↔ <span className="text-slate-100">{e.b}</span> <span className="text-xs text-slate-500">({t("innov.graph.via")} {e.sharedModels.join(", ")})</span></li>)}
                </ul>
              ) : <p className="text-sm text-slate-500">{t("innov.graph.emergentNone")}</p>}
            </Card>
            <Card title={t("innov.graph.central")}>
              {g.central.length ? (
                <ul className="space-y-1 text-sm text-slate-300">{g.central.map((c, i) => <li key={i}>· {c.name} <span className="text-xs text-slate-500">({t("innov.graph.degree")} {c.degree})</span></li>)}</ul>
              ) : <p className="text-sm text-slate-500">{t("innov.graph.centralNone")}</p>}
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
