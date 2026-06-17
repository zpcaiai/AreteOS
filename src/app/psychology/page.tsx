import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import PsychologyStudio from "@/components/PsychologyStudio";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("心理学", "Psychology");

export default async function PsychologyPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.psychology.title")} subtitle={t("page.psychology.subtitle")} />
      <div className="mt-6"><PsychologyStudio /></div>
    </div>
  );
}
