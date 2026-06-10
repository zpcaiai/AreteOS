import { PageHeader } from "@/components/ui";
import EngineStudio from "@/components/naval/EngineStudio";
import { ENGINES } from "@/components/naval/config";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Decision Journal" };
export const dynamic = "force-dynamic";

const config = ENGINES["decision-journal"];

export default async function Page() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("page.naval.decision_journal.title")} subtitle={t("page.naval.decision_journal.subtitle")} />
      <EngineStudio config={config} />
    </div>
  );
}
