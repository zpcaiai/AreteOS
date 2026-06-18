import { titleMeta } from "@/lib/i18n/metadata";
import HealingTimelineClient from "@/components/healing/HealingTimelineClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("疗愈时间线", "Healing Timeline");

export default function HealingTimelinePage() {
  return (
    <div>
      <HealingTimelineClient />
      <Disclaimer />
    </div>
  );
}
