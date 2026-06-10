import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Life Portfolio" };
export const dynamic = "force-dynamic";

const config = ENGINES["life-portfolio"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.life_portfolio.title")} subtitle={t("page.naval.life_portfolio.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
