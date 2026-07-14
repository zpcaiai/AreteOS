import BoardroomClient from "./BoardroomClient";
import { titleMeta } from "@/lib/i18n/metadata";

export const generateMetadata = titleMeta("个人董事会", "Personal Boardroom");

export default function Page() {
  return <BoardroomClient />;
}
