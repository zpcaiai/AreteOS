import { PageHeader } from "@/components/ui";
import PsychologyStudio from "@/components/PsychologyStudio";

export const metadata = { title: "Psychology" };

export default function PsychologyPage() {
  return (
    <div>
      <PageHeader
        title="Psychology"
        subtitle="Evidence-based engines migrated from emotion-sphere — CBT, narrative identity, behavioral activation, decision-motive. Educational, not clinical."
      />
      <div className="mt-6"><PsychologyStudio /></div>
    </div>
  );
}
