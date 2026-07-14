import OnboardingClient from "./OnboardingClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("首跑:走一遍成长闭环", "First run: walk the whole loop");

export default function Page() {
  return <OnboardingClient />;
}
