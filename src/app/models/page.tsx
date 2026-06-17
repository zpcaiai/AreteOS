import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("天才库", "Genius Library");
export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const { t } = await getDict();
  await getUserId();
  const geniuses = await prisma.genius.findMany({ orderBy: { name: "asc" }, include: { strategies: { take: 1 } } });
  return (
    <div>
      <PageHeader title={t("page.models.title")} subtitle={t("page.models.subtitle")} />
      {geniuses.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {geniuses.map((g) => (
            <Link key={g.id} href={`/model/${g.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-indigo-600">
              <div className="text-lg font-semibold">{g.name}</div>
              <div className="text-xs text-slate-500">{[g.era, g.domain].filter(Boolean).join(" · ")}</div>
              <p className="mt-2 text-sm text-slate-400">{g.summary}</p>
              {g.strategies[0] && <p className="mt-2 text-xs text-indigo-300">{g.strategies[0].name}</p>}
            </Link>
          ))}
        </div>
      ) : <Empty>Run <code>npm run db:seed</code> to load the genius library.</Empty>}
    </div>
  );
}
