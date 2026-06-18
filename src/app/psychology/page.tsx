import { titleMeta } from "@/lib/i18n/metadata";
import CounterpartBanner from "@/components/healing/CounterpartBanner";
import { PageHeader } from "@/components/ui";
import PsychologyStudio from "@/components/PsychologyStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("心理学", "Psychology");

export default async function PsychologyPage() {
  const { t } = await getDict();
  return (
    <div>
      <CounterpartBanner href="/cbt" tone="clinical" zh="正处于困扰或危机?用经过安全筛查的临床版 CBT(先做安全分流)" en="In distress or crisis? Use the safety-screened clinical CBT (triage first)" />
      <PageHeader title={t("page.psychology.title")} subtitle={t("page.psychology.subtitle")} />
      <div className="mt-6"><PsychologyStudio /></div>
    </div>
  );
}
