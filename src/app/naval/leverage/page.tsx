import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("杠杆", "Leverage");
export const dynamic = "force-dynamic";

const config = ENGINES["leverage"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.leverage.title")} subtitle={t("page.naval.leverage.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
