import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Specific Knowledge" };
export const dynamic = "force-dynamic";

const config = ENGINES["specific-knowledge"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.specific_knowledge.title")} subtitle={t("page.naval.specific_knowledge.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
