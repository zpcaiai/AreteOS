import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import OnboardingWizard from "@/components/naval/OnboardingWizard";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("Naval 上手", "Naval Onboarding");
export const dynamic = "force-dynamic";

export default async function NavalOnboardingPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.onboarding.title")} subtitle={t("page.naval.onboarding.subtitle")} />
      <OnboardingWizard />
    </div>
  );
}
