import { PageHeader, Card } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Start Here" };

export default async function StartHerePage() {
  const { t } = await getDict();
  const STEPS = [
    { n: 1, title: t("innov.start.s1t"), body: t("innov.start.s1b"), href: "/coach", cta: t("innov.start.s1c") },
    { n: 2, title: t("innov.start.s2t"), body: t("innov.start.s2b"), href: "/twin", cta: t("innov.start.s2c") },
    { n: 3, title: t("innov.start.s3t"), body: t("innov.start.s3b"), href: "/council", cta: t("innov.start.s3c") },
    { n: 4, title: t("innov.start.s4t"), body: t("innov.start.s4b"), href: "/evidence", cta: t("innov.start.s4c") },
    { n: 5, title: t("innov.start.s5t"), body: t("innov.start.s5b"), href: "/narrative", cta: t("innov.start.s5c") },
  ];
  return (
    <div>
      <PageHeader title={t("innov.start.title")} subtitle={t("innov.start.subtitle")} />
      <Card title={t("innov.start.whyTitle")}>
        <p className="text-sm leading-relaxed text-slate-300">{t("innov.start.whyBody")}</p>
      </Card>
      <Card title={t("innov.start.pathTitle")}>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-3 border-t border-slate-800 pt-3 first:border-t-0 first:pt-0">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">{s.n}</span>
              <div>
                <div className="font-semibold text-slate-100">{s.title}</div>
                <p className="text-sm text-slate-400">{s.body}</p>
                <a href={s.href} className="mt-1 inline-block text-sm font-medium text-sky-400 hover:text-sky-300">{s.cta} →</a>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
