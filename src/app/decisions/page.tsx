import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("决策", "Decisions");
export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const decisions = await prisma.decision.findMany({
    where: { userId }, orderBy: { createdAt: "desc" },
    include: { options: true, reviews: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return (
    <div>
      <PageHeader title={t("page.decisions.title")} subtitle={t("page.decisions.subtitle")} />
      <a href="/psychology" className="mb-4 block rounded-xl border border-indigo-900/60 bg-indigo-950/30 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-950/50">New · Decision-motive analysis: surface the motive (fear/pride/values) behind a pending call → Psychology Studio</a>
      <div className="space-y-4">
        {decisions.length ? decisions.map((d) => (
          <Card key={d.id} title={d.title}>
            <p className="text-sm text-slate-400">{d.context}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {d.options.map((o) => <span key={o.id} className={`rounded-full px-3 py-1 text-xs ${o.chosen ? "bg-emerald-700" : "bg-slate-800"}`}>{o.label}</span>)}
            </div>
            {d.quality != null && <div className="mt-3"><ScoreBar label={t("score.decision_quality")} value={d.quality} /></div>}
            {d.reviews[0]?.note && <p className="mt-1 text-sm text-slate-400">{d.reviews[0].note}</p>}
            <p className="mt-2 text-xs text-slate-500">Status: {d.status} · review via POST /api/decisions/{d.id}/review</p>
          </Card>
        )) : <Empty>{t("empty.no_decisions_yet")}</Empty>}
      </div>
    </div>
  );
}
