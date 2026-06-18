import { titleMeta } from "@/lib/i18n/metadata";
import CounterpartBanner from "@/components/healing/CounterpartBanner";
import HealingTimelineClient from "@/components/healing/HealingTimelineClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("疗愈时间线", "Healing Timeline");

export default function HealingTimelinePage() {
  return (
    <div>
      <CounterpartBanner href="/timeline" tone="growth" zh="想看整体成长时间线?→ 成长版「时间线」" en="Want the overall growth timeline? → Growth Timeline" />
      <HealingTimelineClient />
      <Disclaimer />
    </div>
  );
}
