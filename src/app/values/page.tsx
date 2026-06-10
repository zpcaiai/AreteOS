import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Values" };
export const dynamic = "force-dynamic";

export default async function ValuesPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [rankings, conflicts] = await Promise.all([
    prisma.valueRanking.findMany({ where: { userId }, orderBy: { rank: "asc" }, include: { value: true } }),
    prisma.valueConflict.findMany({ where: { userId } }),
  ]);
  return (
    <div>
      <PageHeader title={t("page.values.title")} subtitle={t("page.values.subtitle")} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Value Hierarchy">
          {rankings.length ? <ol className="list-decimal space-y-1 pl-5">{rankings.map((r) => <li key={r.id}><span className="font-medium">{r.value.name}</span> <span className="text-xs text-slate-500">{r.value.description}</span></li>)}</ol> : <Empty>No ranked values yet.</Empty>}
        </Card>
        <Card title="Value Conflicts">
          {conflicts.length ? conflicts.map((c) => <p key={c.id} className="text-sm text-slate-300">{c.context} → <span className="text-emerald-400">{c.resolution}</span></p>) : <Empty>No recorded conflicts.</Empty>}
        </Card>
      </div>
    </div>
  );
}
