import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Mental Model Library" };

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const { t } = await getDict();
  const models = await prisma.cogModel.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const byCat = new Map<string, typeof models>();
  for (const m of models) { const k = m.category; if (!byCat.has(k)) byCat.set(k, []); byCat.get(k)!.push(m); }
  return (
    <div>
      <PageHeader title={t("page.phronesis.models.title")} subtitle={t("page.phronesis.models.subtitle")} />
      {models.length ? [...byCat.entries()].map(([cat, ms]) => (
        <Card key={cat} title={cat.replace(/_/g, " ")}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ms.map((m) => (
              <div key={m.id} className="rounded-lg border border-slate-800 p-3">
                <div className="font-medium text-slate-100">{m.name}</div>
                <div className="text-sm text-slate-400">{m.summary}</div>
                <div className="mt-1 text-xs text-slate-500">When: {m.whenToUse}</div>
              </div>
            ))}
          </div>
        </Card>
      )) : <Empty>Run <code>npm run db:seed</code> to load the 18 core mental models.</Empty>}
    </div>
  );
}
