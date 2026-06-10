import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeCognitive } from "@/lib/phronesis/service";
import { computeGraphInsights } from "@/lib/graph-insights";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import CognitiveStudio from "./CognitiveStudio";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Cognitive OS" };

export const dynamic = "force-dynamic";

export default async function CognitivePage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [h, graph] = await Promise.all([
    computeCognitive(userId),
    computeGraphInsights(userId).catch(() => null),
  ]);
  return (
    <div>
      <PageHeader title={t("page.phronesis.title")} subtitle={t("page.phronesis.subtitle")} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Global Cognitive Score">
          <div className="text-4xl font-bold tabular-nums">{Math.round(h.globalCognitiveScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">(Model diversity × Judgment × Decision quality × Bias resistance × Reflection × Wisdom) ÷ Blind spots</p>
        </Card>
        <Card title="Judgment & Models">
          <ScoreBar label="Judgment" value={h.judgmentScore} />
          <ScoreBar label="Model diversity" value={h.modelDiversity} />
          <ScoreBar label="Bias resistance" value={h.biasResistance} />
        </Card>
        <Card title="Decisions & Wisdom">
          <ScoreBar label="Decision quality" value={h.decisionQuality} />
          <ScoreBar label="Reflection" value={h.reflection} />
          <ScoreBar label="Wisdom" value={h.wisdom} />
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/phronesis/models" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Model library</Link>
            <Link href="/phronesis/dashboard" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Dashboard</Link>
          </div>
        </Card>
      </div>
      {graph && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card title="Next models to learn" accent={graph.source === "neo4j" ? "graph" : undefined}>
            {graph.recommendations.length ? (
              <ul className="space-y-2 text-sm">
                {graph.recommendations.map((r) => (
                  <li key={r.name} className="rounded-lg border border-slate-800 p-2.5">
                    <span className="font-medium text-slate-100">{r.name}</span>
                    <span className="ml-2 text-xs text-slate-500">{r.category.replace(/_/g, " ")}</span>
                    <p className="mt-0.5 text-xs text-slate-400">{r.reason}{r.via.length ? ` — via ${r.via.join(", ")}` : ""}</p>
                  </li>
                ))}
              </ul>
            ) : <Empty>Log model usage to unlock latticework recommendations.</Empty>}
          </Card>
          <Card title="Latticework gaps">
            {graph.gaps.length ? (
              <ul className="space-y-2 text-sm">
                {graph.gaps.map((g) => (
                  <li key={g.category} className="rounded-lg border border-slate-800 p-2.5">
                    <span className="font-medium text-slate-100">{g.category.replace(/_/g, " ")}</span>
                    <span className="ml-2 text-xs text-slate-500">{g.count} model{g.count === 1 ? "" : "s"}</span>
                    <p className="mt-0.5 text-xs text-slate-400">Start with: {g.suggestion}</p>
                  </li>
                ))}
              </ul>
            ) : <Empty>Every major discipline is covered — strong latticework.</Empty>}
          </Card>
          <Card title="Unresolved value tensions">
            {graph.tensions.length ? (
              <ul className="space-y-2 text-sm">
                {graph.tensions.map((t, i) => (
                  <li key={i} className="rounded-lg border border-slate-800 p-2.5">
                    <span className="font-medium text-slate-100">{t.a} ↔ {t.b}</span>
                    {t.context && <p className="mt-0.5 text-xs text-slate-400">{t.context}</p>}
                  </li>
                ))}
              </ul>
            ) : <Empty>No unresolved value conflicts on record.</Empty>}
          </Card>
        </div>
      )}
      <div className="mt-6"><CognitiveStudio /></div>
    </div>
  );
}
