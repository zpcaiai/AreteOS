import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ArchetypesPage({ searchParams }: { searchParams: Promise<{ family?: string }> }) {
  const { locale } = await getDict();
  const en = locale === "en";
  const { family } = await searchParams;
  const archetypes = await prisma.identityArchetype.findMany({
    where: family ? { family: { slug: family } } : undefined,
    orderBy: { name: "asc" },
    include: { family: { select: { name: true, slug: true } } },
  });
  return (
    <div>
      <PageHeader
        title={family ? `${en ? "Identities" : "身份"} · ${archetypes[0]?.family.name ?? family}` : (en ? "All Identities" : "全部身份")}
        subtitle={en ? "Each archetype is a full blueprint: mission, values, beliefs, models, rules, habits, shadows." : "每个原型都是一份完整蓝图:使命、价值观、信念、思维模型、规则、习惯、阴影。"} />
      {archetypes.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {archetypes.map((a) => (
            <Link key={a.id} href={`/ethos/archetype/${a.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-700">
              <div className="font-semibold text-slate-100">{a.name}</div>
              <div className="text-xs text-indigo-300">{a.family.name}</div>
              <div className="mt-1 text-xs italic text-slate-400">{a.identityStatement}</div>
            </Link>
          ))}
        </div>
      ) : <Empty>{en ? <>No archetypes found. Run <code>npm run db:seed</code>.</> : <>未找到原型。请运行 <code>npm run db:seed</code>。</>}</Empty>}
    </div>
  );
}
