import CouncilClient from "./CouncilClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("导师委员会", "Mentor Council");

export default function Page() {
  return <CouncilClient />;
}
