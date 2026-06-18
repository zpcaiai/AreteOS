import { titleMeta } from "@/lib/i18n/metadata";
import CounterpartBanner from "@/components/healing/CounterpartBanner";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty, ScoreBar } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("身份", "Identity");
export const dynamic = "force-dynamic";

export default async function IdentityPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const identities = await prisma.identity.findMany({ where: { userId }, include: { roles: true, scores: { orderBy: { date: "desc" }, take: 1 } } });
  return (
    <div>
      <CounterpartBanner href="/identity-rebuild" tone="clinical" zh="在困扰/危机中重建身份?用临床版「身份重建」(先做安全分流)" en="Rebuilding identity amid distress? Use the clinical Identity Rebuild (triage first)" />
      <PageHeader title={t("page.identity.title")} subtitle={t("page.identity.subtitle")} />
      <div className="grid gap-5 lg:grid-cols-2">
        {identities.length ? identities.map((i) => (
          <Card key={i.id} title={i.name}>
            <p className="text-slate-300">{i.statement || "—"}</p>
            <div className="mt-3"><ScoreBar label={t("score.clarity")} value={i.clarity} /></div>
            {i.scores[0] && <ScoreBar label={t("score.alignment")} value={i.scores[0].alignment} />}
            {i.roles.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{i.roles.map((r) => <span key={r.id} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">{r.name}</span>)}</div>}
          </Card>
        )) : <Empty>{t("empty.no_identities_yet")}</Empty>}
      </div>
    </div>
  );
}
