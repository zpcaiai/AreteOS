import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import GeniusStudio from "@/components/GeniusStudio";

export const metadata = { title: "Genius Strategies" };
export const dynamic = "force-dynamic";

export default async function GeniusPage() {
  const userId = await getUserId();
  const [geniuses, adoptions] = await Promise.all([
    prisma.genius.findMany({ orderBy: { name: "asc" }, include: { strategies: { orderBy: { createdAt: "asc" } } } }),
    prisma.strategyAdoption.findMany({ where: { userId } }),
  ]);
  // Serialize Json fields for the client component.
  const data = geniuses.map((g) => ({
    id: g.id, name: g.name, era: g.era, domain: g.domain,
    strategies: g.strategies.map((s) => ({
      id: s.id, name: s.name, description: s.description,
      identity: s.identity, beliefs: s.beliefs, values: s.values, capabilities: s.capabilities,
      highLeverage: s.highLeverage,
      repSequence: (s.repSequence as unknown as { step: number; system: string; description: string }[] | null) ?? [],
      tote: (s.tote as unknown as { test: string; operate: string; testExit: string; exit: string } | null) ?? null,
      installProtocol: (s.installProtocol as unknown as string[] | null) ?? [],
    })),
  }));
  const ad = adoptions.map((a) => ({ id: a.id, strategyId: a.strategyId, status: a.status }));

  return (
    <div>
      <PageHeader title="Genius Strategies" subtitle="Strategies of Genius × NLP Modeling — reconstruct how a master thinks, then install and practice it." />
      <GeniusStudio geniuses={data} adoptions={ad} />
    </div>
  );
}
