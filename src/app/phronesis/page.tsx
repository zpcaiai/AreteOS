import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { computeCognitive } from "@/lib/phronesis/service";
import { Card, ScoreBar, PageHeader } from "@/components/ui";
import CognitiveStudio from "./CognitiveStudio";

export const metadata = { title: "Cognitive OS" };

export const dynamic = "force-dynamic";

export default async function CognitivePage() {
  const userId = await getUserId();
  const h = await computeCognitive(userId);
  return (
    <div>
      <PageHeader title="Cognitive OS" subtitle="The judgment & decision operating system. Optimize judgment quality, not information quantity." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Global Cognitive Score">
          <div className="text-4xl font-bold tabular-nums">{Math.round(h.globalCognitiveScore * 100)}</div>
          <p className="mt-1 text-xs text-slate-400">(Model diversity × Judgment × Decision quality × Bias resistance × Reflection × Wisdom) ÷ Blind spots</p>
        </Card>
        <Card title="Judgment & Models">
          <ScoreBar label="Judgment" value={h.judgmentScore} />
          <ScoreBar label="Model diversity" value={h.modelDiversity} />
          <ScoreBar label="Bias resistance" value={h.biasResistance} />
        </Card>
        <Card title="Decisions & Wisdom">
          <ScoreBar label="Decision quality" value={h.decisionQuality} />
          <ScoreBar label="Reflection" value={h.reflection} />
          <ScoreBar label="Wisdom" value={h.wisdom} />
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/phronesis/models" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Model library</Link>
            <Link href="/phronesis/dashboard" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">Dashboard</Link>
          </div>
        </Card>
      </div>
      <div className="mt-6"><CognitiveStudio /></div>
    </div>
  );
}
