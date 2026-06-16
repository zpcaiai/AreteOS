"use client";

// Client-side i18n: the layout passes the resolved locale + dictionary down so
// client components translate without another fetch, and the switcher just
// writes the preference cookie and refreshes server components.

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, DICTIONARIES, type Dict, type DictKey, type Locale } from "./dictionaries";
import { txFor } from "./lookup";

interface I18nValue {
  locale: Locale;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: (key) => DICTIONARIES[DEFAULT_LOCALE][key] });

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: (key) => dict[key] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Bilingual helper bound to the current locale: T("中文", "English"). Centralizes
 *  the inline closure the 2026 engine pages each redefined. */
export function useT() {
  const { locale } = useContext(I18nContext);
  return (zh: string, en: string) => (locale === "en" ? en : zh);
}

/** Translate by ENGLISH dictionary value (identity for unknown strings). */
export function useTx() {
  const { locale } = useContext(I18nContext);
  return txFor(locale);
}

const LOCALE_LABELS: Record<Locale, string> = { zh: "中文", en: "EN" };

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();

  function setLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 p-0.5 ${className}`}
      role="group"
      aria-label={t("common.language")}>
      {(["zh", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2.5 py-1 text-xs font-medium leading-none transition-colors ${
            locale === l ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}>
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
