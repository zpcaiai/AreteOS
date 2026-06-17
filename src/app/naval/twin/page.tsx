import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("Naval 数字孪生", "Naval Digital Twin");
export const dynamic = "force-dynamic";

const config = ENGINES["twin"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.twin.title")} subtitle={t("page.naval.twin.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
