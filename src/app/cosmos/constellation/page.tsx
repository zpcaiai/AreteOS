import { PageHeader } from "@/components/ui";
import ConstellationCanvas from "@/components/ConstellationCanvas";
import type { ConsNode } from "@/components/Constellation";

export const metadata = { title: "Constellation" };

// The Arete development system as a navigable sphere (engines + sample values).
const NODES: ConsNode[] = [
  { id: "cosmos", label: "Cosmos", group: "Foundation", blurb: "Worldview — how you interpret reality.", href: "/cosmos" },
  { id: "telos", label: "Telos", group: "Direction", blurb: "Mission & purpose.", href: "/telos" },
  { id: "ethos", label: "Ethos", group: "Direction", blurb: "Identity library.", href: "/ethos" },
  { id: "phronesis", label: "Phronesis", group: "Thinking", blurb: "Judgment & mental models.", href: "/phronesis" },
  { id: "psychology", label: "Psychology", group: "Thinking", blurb: "CBT, narrative identity, decision-motive.", href: "/psychology" },
  { id: "genius", label: "Genius", group: "Thinking", blurb: "Genius strategies.", href: "/genius-strategies" },
  { id: "praxis", label: "Praxis", group: "Execution", blurb: "Habits, mastery, scaling.", href: "/praxis" },
  { id: "habits", label: "Habits", group: "Execution", blurb: "Identity proofs.", href: "/habits" },
  { id: "archon", label: "Archon", group: "Organization", blurb: "Leadership.", href: "/archon" },
  { id: "oikos", label: "Oikos", group: "Organization", blurb: "Relationships & management.", href: "/oikos" },
  { id: "mnemosyne", label: "Mnemosyne", group: "Memory", blurb: "Reflection & memory.", href: "/mnemosyne" },
  { id: "v-truth", label: "Self-honesty", group: "Value" },
  { id: "v-clarity", label: "Inner clarity", group: "Value" },
  { id: "v-resilience", label: "Resilience", group: "Value" },
  { id: "v-relation", label: "Relational health", group: "Value" },
  { id: "v-stability", label: "Emotional stability", group: "Value" },
];

export default function ConstellationPage() {
  return (
    <div>
      <PageHeader title="Constellation" subtitle="Your development system as a navigable WebGL sphere — drag to orbit, scroll to zoom, click a node to open it. Ported from emotion-sphere (react-three-fiber)." />
      <div className="mt-6"><ConstellationCanvas nodes={NODES} title="Arete · Identity & Engine Map" /></div>
    </div>
  );
}
