import { titleMeta } from "@/lib/i18n/metadata";
import PartsWorkClient from "@/components/healing/PartsWorkClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("内在部分工作", "Parts Work");

export default function PartsWorkPage() {
  return (
    <div>
      <PartsWorkClient />
      <Disclaimer />
    </div>
  );
}
