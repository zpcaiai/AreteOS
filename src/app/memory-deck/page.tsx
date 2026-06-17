import { titleMeta } from "@/lib/i18n/metadata";
import MemoryDeckClient from "@/components/MemoryDeckClient";
import { PageHeader } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("记忆卡组", "Memory Deck");

export default async function MemoryDeckPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("memoryDeck.title")} subtitle={t("memoryDeck.subtitle")} />
      <MemoryDeckClient />
    </div>
  );
}

