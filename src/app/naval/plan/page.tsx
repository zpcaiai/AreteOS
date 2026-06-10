import { PageHeader } from "@/components/ui";
import GoalCard from "@/components/naval/GoalCard";
import PlanBoard from "@/components/naval/PlanBoard";
import DueReviews from "@/components/naval/DueReviews";

export const metadata = { title: "90-Day Plan" };
export const dynamic = "force-dynamic";

export default function NavalPlanPage() {
  return (
    <div>
      <PageHeader title="90-Day Naval Life Plan" subtitle="Set a north-star goal, generate a plan from your current state, and check off the work." />
      <div className="space-y-5">
        <GoalCard />
        <PlanBoard />
        <DueReviews />
      </div>
    </div>
  );
}
