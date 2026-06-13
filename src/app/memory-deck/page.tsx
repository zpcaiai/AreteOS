import MemoryDeckClient from "@/components/MemoryDeckClient";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Memory Deck" };

export default function MemoryDeckPage() {
  return (
    <div>
      <PageHeader title="Memory Deck" subtitle="Spaced repetition for principles, lessons, decision rules and identity proofs." />
      <MemoryDeckClient />
    </div>
  );
}

