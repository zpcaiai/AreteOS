import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Happiness" };
export const dynamic = "force-dynamic";

const config = ENGINES["happiness"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.happiness.title")} subtitle={t("page.naval.happiness.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
