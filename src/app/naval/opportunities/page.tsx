import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Permissionless Opportunities" };
export const dynamic = "force-dynamic";

const config = ENGINES["opportunities"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.opportunities.title")} subtitle={t("page.naval.opportunities.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
