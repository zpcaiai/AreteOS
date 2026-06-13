import GrowthPlanet from "@/components/GrowthPlanet";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Growth Map" };

export default function GrowthMapPage() {
  return (
    <div>
      <PageHeader title="Growth Map" subtitle="A path-based navigation layer adapted from bible3dsphere's planet home architecture." />
      <GrowthPlanet />
    </div>
  );
}

