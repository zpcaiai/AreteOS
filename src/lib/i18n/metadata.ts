import type { Metadata } from "next";
import { getLocale } from "./server";

/** Locale-aware page <title>. Usage:
 *    export const generateMetadata = titleMeta("中文标题", "English title"); */
export function titleMeta(zh: string, en: string): () => Promise<Metadata> {
  return async () => {
    const locale = await getLocale();
    return { title: locale === "en" ? en : zh };
  };
}
