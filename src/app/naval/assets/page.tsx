import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Asset Builder" };
export const dynamic = "force-dynamic";

const config = ENGINES["assets"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.assets.title")} subtitle={t("page.naval.assets.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
