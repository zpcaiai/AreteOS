import { titleMeta } from "@/lib/i18n/metadata";
import EmotionRegulationClient from "@/components/healing/EmotionRegulationClient";
import Disclaimer from "@/components/Disclaimer";

export const generateMetadata = titleMeta("情绪调节", "Emotion Regulation");

export default function EmotionRegulationPage() {
  return (
    <div>
      <EmotionRegulationClient />
      <Disclaimer />
    </div>
  );
}
