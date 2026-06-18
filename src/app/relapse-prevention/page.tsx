import { titleMeta } from "@/lib/i18n/metadata";
import RelapsePreventionClient from "@/components/healing/RelapsePreventionClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("复发预防", "Relapse Prevention");

export default function RelapsePreventionPage() {
  return (
    <div>
      <RelapsePreventionClient />
      <Disclaimer />
    </div>
  );
}
