import { PageHeader } from "@/components/ui";
import CoachChat from "@/components/coach/CoachChat";

export const metadata = { title: "AI Coach" };
export const dynamic = "force-dynamic";

export default function CoachPage() {
  return (
    <div>
      <PageHeader
        title="AI Coach"
        subtitle="A stateful coaching conversation grounded in your own data — scores, decisions, reflections, habits, and long-term memory."
      />
      <CoachChat />
    </div>
  );
}
