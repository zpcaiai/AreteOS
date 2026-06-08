import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import { SIX_CAPABILITIES } from "@/lib/genius/constants";
import { ChildCreateForm } from "./ChildClient";

export const metadata = { title: "Genius Kids OS" };

export const dynamic = "force-dynamic";

export default async function ChildHub() {
  const userId = await getUserId();
  const children = await prisma.childProfile.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
  return (
    <div>
      <PageHeader title="Genius Kids OS" subtitle="Raise curious, capable, creative, resilient lifelong learners — not grades. Ages 6–18." />
      <Card title="Why this exists">
        <p className="text-sm text-slate-300">We optimize for the six capabilities that predict long-term flourishing far better than test scores:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIX_CAPABILITIES.map((c) => <span key={c} className="rounded-full bg-indigo-950/50 px-3 py-1 text-xs text-indigo-200">{c}</span>)}
        </div>
      </Card>
      <ChildCreateForm />
      <Card title="Your children">
        {children.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((c) => (
              <Link key={c.id} href={`/genius/${c.id}`} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-700">
                <div className="font-semibold text-slate-100">{c.name}</div>
                <div className="text-xs text-slate-400">Age {c.age}{c.primaryIdentity ? ` · ${c.primaryIdentity}` : ""}</div>
                <div className="mt-1 text-xs text-indigo-300">Open dashboard →</div>
              </Link>
            ))}
          </div>
        ) : <Empty>No children yet — add one above to begin.</Empty>}
      </Card>
    </div>
  );
}
