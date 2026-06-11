import { PageHeader, Card } from "@/components/ui";
import { DISCLAIMER_LONG, INSPIRATIONS } from "@/lib/legal/attributions";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Attributions & Legal" };

export default async function AttributionsPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.about.attributions.title")} subtitle={t("page.about.attributions.subtitle")} />
      <Card title={t("card.disclaimer")}>
        <p className="text-sm leading-relaxed text-slate-300">{DISCLAIMER_LONG}</p>
      </Card>
      <Card title={t("card.inspired_by_ideas_not_implementations")}>
        <ul className="space-y-2 text-sm text-slate-300">
          {INSPIRATIONS.map((i) => (
            <li key={i.area} className="border-t border-slate-800 pt-2">
              <span className="font-semibold text-slate-100">{i.area}</span>
              <div className="text-slate-400">Inspired by {i.inspiredBy}.</div>
            </li>
          ))}
        </ul>
      </Card>
      <Card title={t("card.on_the_figures_in_our_libraries")}>
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
