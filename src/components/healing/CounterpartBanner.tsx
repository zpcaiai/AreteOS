"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

// Soft-merge signpost between a growth-version page and its safety-gated clinical
// (Healing OS) counterpart, in both directions. Keeps the two distinct without
// confusing users. tone="clinical" points growth → healing (rose); tone="growth"
// points healing → growth (indigo).
export default function CounterpartBanner({
  href,
  zh,
  en,
  tone = "clinical",
}: {
  href: string;
  zh: string;
  en: string;
  tone?: "clinical" | "growth";
}) {
  const { locale } = useI18n();
  const cls =
    tone === "clinical"
      ? "border-rose-900/40 bg-rose-950/20 text-rose-100/90 hover:border-rose-700/60"
      : "border-indigo-900/40 bg-indigo-950/20 text-indigo-100/90 hover:border-indigo-600/60";
  return (
    <Link href={href} className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${cls}`}>
      <span>{locale === "en" ? en : zh}</span>
      <span className="ml-auto shrink-0" aria-hidden>→</span>
    </Link>
  );
}
