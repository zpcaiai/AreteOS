import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";

export const metadata = { title: "Identity Families" };

export const dynamic = "force-dynamic";

export default async function FamiliesPage() {
  const families = await prisma.identityFamily.findMany({
    orderBy: { sortOrder: "asc" },
    include: { archetypes: { orderBy: { name: "asc" }, select: { id: true, slug: true, name: true, identityStatement: true } } },
  });
  return (
    <div>
      <PageHeader title="Identity Families" subtitle="Ten families, grouped by the purpose each serves." />
      {families.length ? families.map((f) => (
        <Card key={f.id} title={`${f.name} — ${f.purpose}`}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {f.archetypes.map((a) => (
              <Link key={a.id} href={`/ethos/archetype/${a.slug}`}
                className="rounded-lg border border-slate-800 p-3 hover:border-indigo-700">
                <div className="font-medium text-slate-100">{a.name}</div>
                <div className="text-xs italic text-slate-400">{a.identityStatement}</div>
              </Link>
            ))}
          </div>
        </Card>
      )) : <Empty>Run <code>npm run db:seed</code> to load identities.</Empty>}
    </div>
  );
}
