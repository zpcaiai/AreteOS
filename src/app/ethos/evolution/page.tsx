import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { computeIdentityProfile } from "@/lib/ethos/service";
import { Card, ScoreBar, PageHeader, Empty, Scoreboard } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("身份进化", "Identity Evolution");

export const dynamic = "force-dynamic";

export default async function EvolutionPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const p = await computeIdentityProfile(userId);

  const board: [string, number][] = [
    ["Clarity", p.clarity], ["Alignment", p.alignment], ["Stability", p.stability],
    ["Conflict resolution", p.conflict], ["Evolution", p.evolution], ["Integration", p.integration],
  ];

  return (
    <div>
      <PageHeader title={t("page.ethos.evolution.title")} subtitle={t("page.ethos.evolution.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("card.global_identity_score")}>
          <div className="text-5xl font-bold tabular-nums">{Math.round(p.globalScore * 100)}<span className="text-lg text-slate-500"> / 100</span></div>
        </Card>
        <Card title={t("card.scoreboard")}>
          <div className="mt-1 space-y-2">{board.map(([l, v]) => <ScoreBar key={l} label={l} value={v} />)}</div>
        </Card>
      </div>

      <Card title={t("card.your_identity_stack")}>
        {p.stack.length ? (
          <div className="space-y-2 text-sm">
            {p.stack.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span><span className="font-semibold text-slate-100">{s.archetypeName}</span> <span className="text-xs text-indigo-300">{s.role}</span></span>
                <span className="text-xs text-slate-400">{s.stage}</span>
              </div>
            ))}
          </div>
        ) : <Empty>{t("empty.no_stack_yet_build_one_in")}</Empty>}
      </Card>

      <Card title={t("card.conflicts")}>
        {p.conflicts.length ? (
          <ul className="space-y-2 text-sm">
            {p.conflicts.map((c) => (
              <li key={c.id} className="border-t border-slate-800 pt-2">
                <span className="font-medium text-amber-400">{c.identityA} ⚔ {c.identityB}</span>
                <div className="text-slate-300">{c.tension}</div>
                <div className="text-xs text-emerald-400">Integration: {c.integration}</div>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_conflicts_detected")}</Empty>}
      </Card>

      <Card title={t("card.evolution_timeline")}>
        {p.snapshots.length ? (
          <ul className="space-y-1 text-sm text-slate-300">
            {p.snapshots.map((s) => (
              <li key={s.id} className="flex justify-between border-t border-slate-800 pt-1">
                <span>{s.archetypeSlug} · <span className="text-slate-500">{s.stage}</span></span>
                <span className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : <Empty>{t("empty.no_evolution_snapshots_yet")}</Empty>}
      </Card>
    </div>
  );
}
