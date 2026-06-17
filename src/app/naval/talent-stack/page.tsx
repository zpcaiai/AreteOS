import { titleMeta } from "@/lib/i18n/metadata";
import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("才能栈", "Talent Stack");
export const dynamic = "force-dynamic";

const config = ENGINES["talent-stack"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.talent_stack.title")} subtitle={t("page.naval.talent_stack.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
