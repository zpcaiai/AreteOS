import { PageHeader } from "@/components/ui";
import OnboardingWizard from "@/components/naval/OnboardingWizard";

export const metadata = { title: "Naval Onboarding" };
export const dynamic = "force-dynamic";

export default function NavalOnboardingPage() {
  return (
    <div>
      <PageHeader title="Get set up" subtitle="Eleven steps to seed your Naval Life OS — specific knowledge through your first 90-day plan." />
      <OnboardingWizard />
    </div>
  );
}
