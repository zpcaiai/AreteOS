import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeNavalDashboard, snapshotTrend } from "@/lib/naval/service";
import { Card, Scoreboard, StatGrid, PageHeader, Empty, Line } from "@/components/ui";
import Radar from "@/components/naval/Radar";
import PlanButton from "@/components/naval/PlanButton";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("Naval 仪表盘", "Naval Dashboard");
export const dynamic = "force-dynamic";

export default async function NavalDashboard() {
  const { t, locale } = await getDict();
  const en = locale === "en";
  const userId = await getUserId();
  const [d, trend] = await Promise.all([computeNavalDashboard(userId), snapshotTrend(userId)]);
  const s = d.scores;

  // Scoreboard expects 0..1 values
  const board: [string, number][] = [
    ["Global Naval", s.global / 100], ["Specific knowledge", s.specificKnowledge / 100], ["Talent stack", s.talentStack / 100],
    ["Leverage", s.leverage / 100], ["Judgment", s.judgment / 100], ["Wealth creation", s.wealthCreation / 100],
    ["Long-term game", s.longTermGame / 100], ["Freedom", s.freedom / 100], ["Happiness", s.happiness / 100],
    ["Life portfolio", s.lifePortfolio / 100],
  ];
  const radar = [
    { label: "Knowledge", value: s.specificKnowledge }, { label: "Judgment", value: s.judgment },
    { label: "Leverage", value: s.leverage }, { label: "Wealth", value: s.wealthCreation },
    { label: "Freedom", value: s.freedom }, { label: "Happiness", value: s.happiness },
    { label: "Portfolio", value: s.lifePortfolio },
  ];

  return (
    <div>
      <PageHeader title={t("page.naval.dashboard.title")} subtitle={t("page.naval.dashboard.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_naval_score")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(s.global)}</div>
          <div className="mt-4"><StatGrid items={[
            { value: d.counts.assets, label: "Assets" }, { value: d.counts.decisions, label: "Decisions" },
            { value: d.counts.opportunities, label: "Opportunities" }, { value: d.counts.games, label: "Games" },
          ]} /></div>
        </Card>
        <Card title={t("card.seven_drivers")}><Radar points={radar} /></Card>
        <Card title={t("card.recommended_next_action")}>
          <p className="text-sm text-slate-300">{d.recommendedNextAction}</p>
          {trend.length > 1 && <div className="mt-4"><div className="mb-1 text-xs text-slate-500">{en ? "Global score trend" : "全局分趋势"}</div><Line values={trend.map((t) => t.global / 100)} /></div>}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.scoreboard")}><Scoreboard rows={board} /></Card>
        <Card title={t("card.long_term_games")}>
          {d.longTermGames.length ? (
            <ul className="space-y-2 text-sm">
              {d.longTermGames.map((g) => (
                <li key={g.id} className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-200">{g.name}</span><span className="tabular-nums text-slate-400">{g.score != null ? Math.round(g.score) : "—"}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>{en ? "No long-term games chosen yet. " : "还没有选择长期游戏。"}<Link href="/naval/long-term-games" className="text-indigo-400">{en ? "Assess one →" : "去评估一个 →"}</Link></Empty>}
        </Card>
      </div>

      <div className="mt-6">
        <Card title={t("card.90_day_naval_life_plan")}>
          <p className="mb-3 text-sm text-slate-400">Discover (month 1) → Build leverage & choose a game (month 2) → Launch & review (month 3).</p>
          <PlanButton />
        </Card>
      </div>
    </div>
  );
}
