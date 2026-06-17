import { titleMeta } from "@/lib/i18n/metadata";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("传承", "Legacy");
export const dynamic = "force-dynamic";

export default async function LegacyPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [projects, mentees, assets] = await Promise.all([
    prisma.legacyProject.findMany({ where: { userId } }),
    prisma.mentee.findMany({ where: { userId } }),
    prisma.knowledgeAsset.findMany({ where: { userId } }),
  ]);
  return (
    <div>
      <PageHeader title={t("page.legacy.title")} subtitle={t("page.legacy.subtitle")} />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title={`Institutions (${projects.length})`}>{projects.length ? projects.map((p) => <p key={p.id} className="text-sm">{p.title}</p>) : <Empty>{t("empty.none_yet")}</Empty>}</Card>
        <Card title={`Mentees (${mentees.length})`}>{mentees.length ? mentees.map((m) => <p key={m.id} className="text-sm">{m.name} <span className="text-xs text-slate-500">{m.focus}</span></p>) : <Empty>{t("empty.none_yet")}</Empty>}</Card>
        <Card title={`Knowledge Assets (${assets.length})`}>{assets.length ? assets.map((a) => <p key={a.id} className="text-sm">{a.title} <span className="text-xs text-slate-500">{a.type}</span></p>) : <Empty>{t("empty.none_yet")}</Empty>}</Card>
      </div>
    </div>
  );
}
