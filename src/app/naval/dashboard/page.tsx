import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeNavalDashboard, snapshotTrend } from "@/lib/naval/service";
import { Card, Scoreboard, StatGrid, PageHeader, Empty, Line } from "@/components/ui";
import Radar from "@/components/naval/Radar";
import PlanButton from "@/components/naval/PlanButton";

export const metadata = { title: "Naval Dashboard" };
export const dynamic = "force-dynamic";

export default async function NavalDashboard() {
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
      <PageHeader title="Naval Dashboard" subtitle="Your life-strategy cockpit: specific knowledge, leverage, judgment, ownership, freedom, happiness." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Global Naval Score">
          <div className="text-5xl font-bold tabular-nums">{Math.round(s.global)}</div>
          <div className="mt-4"><StatGrid items={[
            { value: d.counts.assets, label: "Assets" }, { value: d.counts.decisions, label: "Decisions" },
            { value: d.counts.opportunities, label: "Opportunities" }, { value: d.counts.games, label: "Games" },
          ]} /></div>
        </Card>
        <Card title="Seven drivers"><Radar points={radar} /></Card>
        <Card title="Recommended next action">
          <p className="text-sm text-slate-300">{d.recommendedNextAction}</p>
          {trend.length > 1 && <div className="mt-4"><div className="mb-1 text-xs text-slate-500">Global score trend</div><Line values={trend.map((t) => t.global / 100)} /></div>}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Scoreboard"><Scoreboard rows={board} /></Card>
        <Card title="Long-term games">
          {d.longTermGames.length ? (
            <ul className="space-y-2 text-sm">
              {d.longTermGames.map((g) => (
                <li key={g.id} className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-200">{g.name}</span><span className="tabular-nums text-slate-400">{g.score != null ? Math.round(g.score) : "—"}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No long-term games chosen yet. <Link href="/naval/long-term-games" className="text-indigo-400">Assess one →</Link></Empty>}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="90-Day Naval Life Plan">
          <p className="mb-3 text-sm text-slate-400">Discover (month 1) → Build leverage & choose a game (month 2) → Launch & review (month 3).</p>
          <PlanButton />
        </Card>
      </div>
    </div>
  );
}
