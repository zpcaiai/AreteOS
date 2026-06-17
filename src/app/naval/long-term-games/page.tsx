import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("长期游戏", "Long-Term Games");
export const dynamic = "force-dynamic";

const config = ENGINES["long-term-games"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.long_term_games.title")} subtitle={t("page.naval.long_term_games.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
