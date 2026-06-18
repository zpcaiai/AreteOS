import type { Metadata } from "next";
import { getLocale } from "./server";

/** Locale-aware page <title> (+ optional <meta description>). Usage:
 *    export const generateMetadata = titleMeta("中文标题", "English title");
 *    export const generateMetadata = titleMeta("标题", "Title", "中文描述", "English description"); */
export function titleMeta(zh: string, en: string, descZh?: string, descEn?: string): () => Promise<Metadata> {
  return async () => {
    const isEn = (await getLocale()) === "en";
    const meta: Metadata = { title: isEn ? en : zh };
    const desc = isEn ? (descEn ?? descZh) : (descZh ?? descEn);
    if (desc) meta.description = desc;
    return meta;
  };
}
