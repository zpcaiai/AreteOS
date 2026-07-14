import JourneyClient from "./JourneyClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("成长全景", "Journey · mission control");

export default function Page() {
  return <JourneyClient />;
}
