import { titleMeta } from "@/lib/i18n/metadata";
import { getDict } from "@/lib/i18n/server";
import { PageHeader } from "@/components/ui";
import EmotionPlanetCanvas from "@/components/EmotionPlanetCanvas";

export const generateMetadata = titleMeta("情绪星球", "Emotion Planet");

export default async function EmotionsPage() {
  const { locale } = await getDict();
  const en = locale === "en";
  return (
    <div>
      <PageHeader
        title={en ? "Pathos · Emotion Planet" : "Pathos · 情绪星球"}
        subtitle={
          en
            ? "171 emotions on a navigable sphere — see what you're feeling, then work with it."
            : "171 种情绪排布成一颗可探索的星球 —— 先看见此刻的感受，再与它相处。"
        }
      />
      <div className="mt-6">
        <EmotionPlanetCanvas />
      </div>
    </div>
  );
}
