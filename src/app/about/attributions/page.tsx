import { PageHeader, Card } from "@/components/ui";
import { DISCLAIMER_LONG, INSPIRATIONS } from "@/lib/legal/attributions";

export const metadata = { title: "Attributions & Legal" };

export default function AttributionsPage() {
  return (
    <div>
      <PageHeader title="Attributions & Legal" subtitle="What inspired this work, and what this product is not." />
      <Card title="Disclaimer">
        <p className="text-sm leading-relaxed text-slate-300">{DISCLAIMER_LONG}</p>
      </Card>
      <Card title="Inspired by (ideas, not implementations)">
        <ul className="space-y-2 text-sm text-slate-300">
          {INSPIRATIONS.map((i) => (
            <li key={i.area} className="border-t border-slate-800 pt-2">
              <span className="font-semibold text-slate-100">{i.area}</span>
              <div className="text-slate-400">Inspired by {i.inspiredBy}.</div>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="On the figures in our libraries">
        <p className="text-sm leading-relaxed text-slate-300">
          Historical and contemporary figures are presented as factual, educational case studies — original
          analysis of publicly documented ways of thinking and working. No verbatim text, diagrams, or tables
          from any book are reproduced. These individuals (and their estates or companies) do not endorse, sponsor,
          or have any association with this product.
        </p>
      </Card>
    </div>
  );
}
