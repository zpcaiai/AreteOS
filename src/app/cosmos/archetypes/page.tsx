import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";

export const metadata = { title: "Worldview Archetypes" };

export const dynamic = "force-dynamic";

export default async function WorldviewArchetypesPage() {
  const archetypes = await prisma.worldviewArchetype.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Worldview Archetypes" subtitle="Ten reality-interpretation stances, each with its mission, assumptions, blind spots and growth edges." />
      {archetypes.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {archetypes.map((a) => (
            <Card key={a.id} title={a.name}>
              <p className="text-sm text-slate-300">{a.mission}</p>
              <p className="mt-2 text-xs text-slate-500">Assumes: {a.coreAssumptions.join("; ")}</p>
              <p className="mt-1 text-xs text-amber-400">Blind spots: {a.blindSpots.join("; ")}</p>
              <p className="mt-1 text-xs text-emerald-400">Grow: {a.growthOpportunities.join("; ")}</p>
            </Card>
          ))}
        </div>
      ) : <Empty>Run <code>npm run db:seed</code> to load the 10 worldview archetypes.</Empty>}
    </div>
  );
}
