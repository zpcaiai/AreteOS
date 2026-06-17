import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeCognitive } from "@/lib/phronesis/service";
import { computeGraphInsights } from "@/lib/graph-insights";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import CognitiveStudio from "./CognitiveStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("认知 OS", "Cognitive OS");

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
        <Card title={t("card.global_cognitive_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(h.globalCognitiveScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">(Model diversity × Judgment × Decision quality × Bias resistance × Reflection × Wisdom) ÷ Blind spots</p>
        </Card>
        <Card title={t("card.judgment_models")}>
          <ScoreBar label={t("score.judgment")} value={h.judgmentScore} />
          <ScoreBar label={t("score.model_diversity")} value={h.modelDiversity} />
          <ScoreBar label={t("score.bias_resistance")} value={h.biasResistance} />
        </Card>
        <Card title={t("card.decisions_wisdom")}>
          <ScoreBar label={t("score.decision_quality")} value={h.decisionQuality} />
          <ScoreBar label={t("score.reflection")} value={h.reflection} />
          <ScoreBar label={t("score.wisdom")} value={h.wisdom} />
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/phronesis/models" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Model library</Link>
            <Link href="/phronesis/dashboard" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Dashboard</Link>
          </div>
        </Card>
      </div>
      {graph && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card title={t("card.next_models_to_learn")} accent={graph.source === "neo4j" ? "graph" : undefined}>
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
            ) : <Empty>{t("empty.log_model_usage_to_unlock_latticework")}</Empty>}
          </Card>
          <Card title={t("card.latticework_gaps")}>
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
            ) : <Empty>{t("empty.every_major_discipline_is_covered_strong")}</Empty>}
          </Card>
          <Card title={t("card.unresolved_value_tensions")}>
            {graph.tensions.length ? (
              <ul className="space-y-2 text-sm">
                {graph.tensions.map((t, i) => (
                  <li key={i} className="rounded-lg border border-slate-800 p-2.5">
                    <span className="font-medium text-slate-100">{t.a} ↔ {t.b}</span>
                    {t.context && <p className="mt-0.5 text-xs text-slate-400">{t.context}</p>}
                  </li>
                ))}
              </ul>
            ) : <Empty>{t("empty.no_unresolved_value_conflicts_on_record")}</Empty>}
          </Card>
        </div>
      )}
      <div className="mt-6"><CognitiveStudio /></div>
    </div>
  );
}
