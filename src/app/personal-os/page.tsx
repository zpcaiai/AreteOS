import PersonalOsClient from "./PersonalOsClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("人生 OS 编译器", "Personal OS Compiler");

export default function Page() {
  return <PersonalOsClient />;
}
