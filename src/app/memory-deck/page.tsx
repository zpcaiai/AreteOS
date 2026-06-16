import MemoryDeckClient from "@/components/MemoryDeckClient";
import { PageHeader } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Memory Deck" };

export default async function MemoryDeckPage() {
  const { t } = await getDict();
  return (
    <div>
      <PageHeader title={t("memoryDeck.title")} subtitle={t("memoryDeck.subtitle")} />
      <MemoryDeckClient />
    </div>
  );
}

