import NarrativeClient from "./NarrativeClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("成长叙事", "Growth Narrative");

export default function Page() {
  return <NarrativeClient />;
}
