import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, PageHeader, Empty } from "@/components/ui";
import ReviewGenerator from "@/components/ReviewGenerator";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const { t } = await getDict();
  const userId = await getUserId();
  const reviews = await prisma.review.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 });
  return (
    <div>
      <PageHeader title={t("page.reviews.title")} subtitle={t("page.reviews.subtitle")} />
      <div className="mb-5"><ReviewGenerator /></div>
      <div className="space-y-4">
        {reviews.length ? reviews.map((r) => (
          <Card key={r.id} title={`${r.period} · ${r.periodKey}`}>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{r.summary}</pre>
          </Card>
        )) : <Empty>{t("empty.no_reviews_yet_generate_one_above")}</Empty>}
      </div>
    </div>
  );
}
