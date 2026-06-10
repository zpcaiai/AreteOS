import { PageHeader } from "@/components/ui";
import GoalCard from "@/components/naval/GoalCard";
import PlanBoard from "@/components/naval/PlanBoard";
import DueReviews from "@/components/naval/DueReviews";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "90-Day Plan" };
export const dynamic = "force-dynamic";

export default async function NavalPlanPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.plan.title")} subtitle={t("page.naval.plan.subtitle")} />
      <div className="space-y-5">
        <GoalCard />
        <PlanBoard />
        <DueReviews />
      </div>
    </div>
  );
}
