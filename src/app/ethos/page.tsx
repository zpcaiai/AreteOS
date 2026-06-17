import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeIdentityProfile } from "@/lib/ethos/service";
import { Card, ScoreBar, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("身份库", "Identity Library");

export const dynamic = "force-dynamic";

export default async function IdentityLibraryPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const [profile, families] = await Promise.all([
    computeIdentityProfile(userId),
    prisma.identityFamily.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { archetypes: true } } } }),
  ]);

  return (
    <div>
      <PageHeader title={t("page.ethos.title")} subtitle={t("page.ethos.subtitle")} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title={t("card.global_identity_score")}>
          <div className="text-4xl font-bold tabular-nums">{Math.round(profile.globalScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">Clarity × Alignment × Stability × Conflict-resolution × Evolution × Integration</p>
        </Card>
        <Card title={t("card.your_identity_health")}>
          <ScoreBar label={t("score.clarity")} value={profile.clarity} />
          <ScoreBar label={t("score.stability")} value={profile.stability} />
          <ScoreBar label={t("score.integration")} value={profile.integration} />
        </Card>
        <Card title={t("card.get_started")}>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/ethos/assessment" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-center font-medium">Assess my identity</Link>
            <Link href="/ethos/stack" className="rounded-lg bg-slate-800 px-3 py-1.5 text-center hover:bg-slate-700">Build my stack</Link>
            <Link href="/ethos/evolution" className="rounded-lg bg-slate-800 px-3 py-1.5 text-center hover:bg-slate-700">Track evolution</Link>
          </div>
        </Card>
      </div>

      <Card title={t("card.identity_families")}>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {families.length ? families.map((f) => (
            <Link key={f.id} href={`/ethos/archetypes?family=${f.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-700">
              <div className="font-semibold text-slate-100">{f.name}</div>
              <div className="text-xs text-slate-400">{f.purpose}</div>
              <div className="mt-2 text-xs text-indigo-300">{f._count.archetypes} identities →</div>
            </Link>
          )) : <Empty>Run <code>npm run db:seed</code> to load the 10 families and 55 archetypes.</Empty>}
        </div>
        <Link href="/ethos/families" className="mt-3 inline-block text-sm text-indigo-400">All families →</Link>
      </Card>
    </div>
  );
}
