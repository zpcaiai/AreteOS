import { titleMeta } from "@/lib/i18n/metadata";
import GrowthPlanet from "@/components/GrowthPlanet";
import { PageHeader } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("成长地图", "Growth Map");

export default async function GrowthMapPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("growthMap.title")} subtitle={t("growthMap.subtitle")} />
      <GrowthPlanet />
    </div>
  );
}

