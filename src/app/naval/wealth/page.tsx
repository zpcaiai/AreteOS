import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("财富创造", "Wealth Creation");
export const dynamic = "force-dynamic";

const config = ENGINES["wealth"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.wealth.title")} subtitle={t("page.naval.wealth.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
