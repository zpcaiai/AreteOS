import TeamClient from "./TeamClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("团队席位", "Team seats");

export default function Page() {
  return <TeamClient />;
}
