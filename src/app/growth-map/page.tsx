import GrowthPlanet from "@/components/GrowthPlanet";
import { PageHeader } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Growth Map" };

export default async function GrowthMapPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("growthMap.title")} subtitle={t("growthMap.subtitle")} />
      <GrowthPlanet />
    </div>
  );
}

