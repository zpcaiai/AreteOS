import TodayClient from "./TodayClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("今天", "Today");

export default function Page() {
  return <TodayClient />;
}
