"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useApi } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/client";
import { isUpgradeError, UpgradeNotice } from "@/components/UpgradeGate";

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
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder={t("innov.graph.fromPlaceholder")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
          <span className="text-slate-500">→</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder={t("innov.graph.toPlaceholder")} className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 text-slate-200" />
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
