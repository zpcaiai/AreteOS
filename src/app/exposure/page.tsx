import { titleMeta } from "@/lib/i18n/metadata";
import ExposureClient from "@/components/healing/ExposureClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("回避与暴露", "Avoidance & Exposure");

export default function ExposurePage() {
  return (
    <div>
      <ExposureClient />
      <Disclaimer />
    </div>
  );
}
